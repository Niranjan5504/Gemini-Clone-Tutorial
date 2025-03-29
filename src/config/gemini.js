async function run(prompt, language) {
  try {
    // Step 1: Send prompt to /refine_query API
    const refineResponse = await fetch("https://api-lp96.onrender.com/generate-recipe/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      mode: "cors", 
      body: JSON.stringify({ recipe_name: prompt, language_option: language }),
    });

    if (!refineResponse.ok) throw new Error("Failed to get refined query");
    const refineData = await refineResponse.json();

   

    console.log(refineData.recipe)

    // Return formatted response
    return refineData.recipe;

  } catch (error) {
    console.error("Error fetching responses:", error);
    return "❌ An error occurred while fetching responses.";
  }
}

export default run;
