// netlify/functions/api.js
exports.handler = async (event, context) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json'
  };
  
  // CORS preflight
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers, body: '' };
  }
  
  try {
    // Определяем, какой эндпоинт вызвали
    const urlPath = event.path;
    const queryParams = event.queryStringParameters || {};
    
    // 🔥 Эндпоинт: /api/resolve-inn?name=...
    if (urlPath.includes('/resolve-inn') && event.httpMethod === 'GET') {
      const drugName = queryParams.name;
      
      if (!drugName) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ error: 'No drug name provided' })
        };
      }
      
      // Вызываем RxNorm API (не требует ключа)
      const rxnormUrl = `https://rxnav.nlm.nih.gov/REST/drugs.json?name=${encodeURIComponent(drugName)}`;
      const response = await fetch(rxnormUrl);
      const data = await response.json();
      
      // Парсим INN
      let inn = null;
      if (data.drugGroup?.conceptGroup) {
        for (const group of data.drugGroup.conceptGroup) {
          if (group.conceptProperties?.[0]?.synonym) {
            inn = group.conceptProperties[0].synonym;
            break;
          }
        }
      }
      
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ 
          success: true, 
          inn: inn || drugName,
          found: !!inn 
        })
      };
    }
    
    // Если эндпоинт не найден
    return {
      statusCode: 404,
      headers,
      body: JSON.stringify({ error: 'Endpoint not found' })
    };
    
  } catch (error) {
    console.error('Function error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Internal server error', details: error.message })
    };
  }
};