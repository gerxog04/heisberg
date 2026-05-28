// netlify/functions/api.js
exports.handler = async (event, context) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json'
  };
  
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers, body: '' };
  }
  
  try {
    const urlPath = event.path;
    const queryParams = event.queryStringParameters || {};
    
    // Эндпоинт: /api/resolve-inn?name=...
    if (urlPath.includes('/resolve-inn')) {
      const drugName = queryParams.name;
      if (!drugName) {
        return { statusCode: 400, headers, body: JSON.stringify({ error: 'No drug name provided' }) };
      }
      
      const response = await fetch(`https://rxnav.nlm.nih.gov/REST/drugs.json?name=${encodeURIComponent(drugName)}`);
      const data = await response.json();
      
      let inn = null;
      if (data.drugGroup?.conceptGroup) {
        for (const group of data.drugGroup.conceptGroup) {
          if (group.conceptProperties?.[0]?.synonym) {
            inn = group.conceptProperties[0].synonym;
            break;
          }
        }
      }
      
      return { statusCode: 200, headers, body: JSON.stringify({ success: true, inn: inn || drugName, found: !!inn }) };
    }
    
    // 🔥 Эндпоинт: /api/fda-analogues?ingredient=...
    if (urlPath.includes('/fda-analogues')) {
      const ingredient = queryParams.ingredient;
      if (!ingredient) {
        return { statusCode: 400, headers, body: JSON.stringify({ error: 'No ingredient provided' }) };
      }
      
      // Поиск аналогов в FDA
      const fdaUrl = `https://api.fda.gov/drug/label.json?search=active_ingredient:${encodeURIComponent(ingredient)}&limit=10`;
      const response = await fetch(fdaUrl);
      const data = await response.json();
      
      if (!data.results) {
        return { statusCode: 200, headers, body: JSON.stringify({ analogues: [] }) };
      }
      
      const analogues = data.results.map(result => ({
        name: result.openfda?.brand_name?.[0] || 'Unknown',
        manufacturer: result.openfda?.manufacturer_name?.[0] || 'Unknown',
        dosage: result.dosage_form_and_strength?.[0] || 'Not specified'
      }));
      
      return { statusCode: 200, headers, body: JSON.stringify({ analogues }) };
    }
    
    return { statusCode: 404, headers, body: JSON.stringify({ error: 'Endpoint not found' }) };
    
  } catch (error) {
    console.error('Function error:', error);
    return { statusCode: 500, headers, body: JSON.stringify({ error: 'Internal server error' }) };
  }
};