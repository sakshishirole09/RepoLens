const detectProjectType = (files) => {

  const fileNames = files.map((file) =>
    file.name.toLowerCase()
  );
const packageResponse =
 await githubAPI.get(
 `/repos/${username}/${repo}/contents/package.json`
 );


const packageData =
 JSON.parse(
 Buffer.from(
 packageResponse.data.content,
 "base64"
 ).toString()
 );

  // React + Vite
  if (
    fileNames.includes("package.json") &&
    (
      fileNames.includes("vite.config.js") ||
      fileNames.includes("vite.config.ts")
    )
  ) {
    return "React + Vite";
  }


  // Next.js
  if (
    fileNames.includes("next.config.js") ||
    fileNames.includes("next.config.mjs")
  ) {
    return "Next.js";
  }
if (
  files.includes("package.json")
) {
  projectType = "JavaScript Project";
}

if (
  files.includes("Cargo.toml")
) {
  projectType = "Rust Project";
}

  // Node Express
  if (
    fileNames.includes("server.js") ||
    fileNames.includes("app.js")
  ) {
    return "Node.js + Express";
  }


  // Laravel
  if (
    fileNames.includes("artisan")
  ) {
    return "Laravel";
  }


  // CodeIgniter 4
  if (
    fileNames.includes("spark") ||
    fileNames.includes("writable") ||
    fileNames.includes("system")
  ) {
    return "CodeIgniter 4";
  }


  // React Library / Large JS Library
  if (
    fileNames.includes("package.json") &&
    fileNames.includes("packages")
  ) {
    return "JavaScript Library";
  }


  // Generic JS project
  if (
    fileNames.includes("package.json")
  ) {
    return "JavaScript Project";
  }


  // PHP
  if (
    fileNames.includes("composer.json") ||
    fileNames.includes("index.php")
  ) {
    return "PHP Project";
  }

if(packageData.dependencies?.react)
{
 projectType="React Application";
}

else if(packageData.devDependencies?.typescript)
{
 projectType="TypeScript Project";
}

else if(packageData.dependencies?.express)
{
 projectType="Node.js + Express";
}
  return "Unknown Project Type";
};


module.exports = detectProjectType;