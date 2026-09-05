const analyzeHealth = (files = []) => {
  let score = 0;

  const checks = {
    readme: files.includes("README.md"),
    license: files.includes("LICENSE"),
    gitignore: files.includes(".gitignore"),
    packageJson: files.includes("package.json"),
    contributing: files.includes("CONTRIBUTING.md"),
    ciCd: files.includes(".github") || files.includes(".github/workflows"),
  };

  if (checks.readme) score += 20;
  if (checks.license) score += 20;
  if (checks.gitignore) score += 15;
  if (checks.packageJson) score += 15;
  if (checks.contributing) score += 15;
  if (checks.ciCd) score += 15;

  return {
    score,
    grade: score >= 90 ? "A" : score >= 75 ? "B" : score >= 60 ? "C" : "D",
    checks,
  };
};

module.exports = analyzeHealth;
