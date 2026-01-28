// Quick test to check API response
async function testAPI() {
  const response = await fetch('http://localhost:3000/api/recommend', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      query: 'blush for fair skin',
      filters: []
    }),
  });

  const data = await response.json();
  console.log('API Response:');
  console.log('Total matches:', data.matches?.length);
  console.log('\nFirst 3 products:');
  data.matches?.slice(0, 3).forEach((p, i) => {
    console.log(`\n${i + 1}. ${p.product_name}`);
    console.log(`   Price: $${p.price}`);
    console.log(`   Category: ${p.category}`);
    console.log(`   Image: ${p.image_url || 'MISSING'}`);
    console.log(`   Variant: ${p.variant_title_product || 'N/A'}`);
  });
}

testAPI();
