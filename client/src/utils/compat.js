export function analyzeStack(schema, selected, slug) {
  if (!schema) {
    console.warn(`analyzeStack: Invalid schema for slug "${slug}"`);
    return {
      picked: [],
      aggregateScores: {},
      warnings: [],
      suggestions: [],
      compatibilityScore: 0,
      roleHints: [],
      distribution: {},
      viable: false
    };
  }

  const picked = [];
  for (const [sd, comps] of Object.entries(selected || {})) {
    for (const [ck, ids] of Object.entries(comps || {})) {
      const comp = schema?.subdomains?.[sd]?.components?.[ck];
      if (!comp) continue;
      for (const id of ids) {
        const tool = comp.tools.find(t => t.id === id);
        if (tool) picked.push({ subdomain: sd, component: ck, type: comp.type || ck, ...tool });
      }
    }
  }

  const facets = ["performance", "scalability", "learning", "demand"];
  const agg = { performance: 0, scalability: 0, learning: 0, demand: 0 };
  if (picked.length) {
    for (const f of facets) {
      agg[f] = Math.round(
        10 * (picked.reduce((s, t) => s + (t.scores?.[f] || 0), 0) / picked.length)
      ) / 10;
    }
  }

  const warnings = [];
  const suggestions = [];

  const has = (id) => picked.some(p => p.id === id);
  const hasType = (t) => picked.some(p => p.type === t);
  const hasSubdomain = (sd) => picked.some(p => p.subdomain === sd);

  let ok = false; // viable flag
  const roleHints = [];

  switch (slug) {
    case "web":
      ok = hasType("framework") && hasType("runtime") && hasType("db");
      if (hasType("framework") && hasType("runtime") && hasType("db")) roleHints.push("Full-stack Developer");
      else {
        if (hasType("framework")) roleHints.push("Frontend Developer");
        if (hasType("db") || hasType("runtime")) roleHints.push("Backend Developer");
      }

      // Suggestions
      if (!hasType("framework")) suggestions.push("Pick a web framework (React, Angular, Vue) for building your UI.");
      if (!hasType("runtime")) suggestions.push("Select a runtime (Node.js, Deno) to run your server code.");
      if (!hasType("db")) suggestions.push("Add a database (PostgreSQL, MongoDB, MySQL) for persistence.");
      break;

    case "cloud":
      ok = hasSubdomain("compute") && hasSubdomain("storage") && hasSubdomain("network");
      if (hasSubdomain("compute")) roleHints.push("Cloud Engineer");
      if (ok) roleHints.push("Cloud Architect");
      if (has(p => ["docker", "kubernetes"].includes(p.id))) roleHints.push("Containers / Orchestration Engineer");

      // Cloud suggestions
      if (!hasSubdomain("compute")) suggestions.push("Pick a compute service (EC2, Azure VM, Docker) to run workloads.");
      if (!hasSubdomain("storage")) suggestions.push("Select storage options like S3 or Azure Blob for persistence.");
      if (!hasSubdomain("network")) suggestions.push("Add a networking component like VPC or Route 53 for connectivity.");
      break;

    case "mobile":
      ok = hasSubdomain("framework") || hasSubdomain("language");
      if (hasSubdomain("framework")) roleHints.push("Mobile Developer");
      if (!ok) roleHints.push("Mobile Developer");
      if (!hasSubdomain("framework")) suggestions.push("Select a mobile framework (React Native, Flutter) to start development.");
      if (!hasSubdomain("language")) suggestions.push("Pick a programming language (Swift, Kotlin) for your app.");
      break;

    case "database":
      ok = hasSubdomain("engines") || hasSubdomain("tools");
      if (hasSubdomain("engines")) roleHints.push("Database Engineer");
      if (hasType("orm")) roleHints.push("ORM Specialist");
      if (!hasSubdomain("engines")) suggestions.push("Add a database engine (Postgres, MySQL, MongoDB) for storage.");
      if (!hasSubdomain("tools")) suggestions.push("Include database tools (Prisma, TypeORM) for management.");
      break;

    case "devops":
      ok = hasSubdomain("ci-cd") || hasSubdomain("containers") || hasSubdomain("monitoring");
      if (hasSubdomain("ci-cd")) roleHints.push("DevOps Engineer");
      if (hasSubdomain("containers")) roleHints.push("Containerization Specialist");
      if (hasSubdomain("monitoring")) roleHints.push("Site Reliability Engineer (SRE)");
      if (!hasSubdomain("ci-cd")) suggestions.push("Pick a CI/CD tool (GitHub Actions, Jenkins) for automation.");
      if (!hasSubdomain("containers")) suggestions.push("Add container tools (Docker, Kubernetes) for deployments.");
      if (!hasSubdomain("monitoring")) suggestions.push("Include monitoring tools (Prometheus, Grafana) for observability.");
      break;

    case "security":
      ok = hasSubdomain("appsec") || hasSubdomain("cloudsec") || hasSubdomain("monitoring");
      if (hasSubdomain("appsec")) roleHints.push("Application Security Engineer");
      if (hasSubdomain("cloudsec")) roleHints.push("Cloud Security Engineer");
      if (hasSubdomain("monitoring")) roleHints.push("Security Analyst");
      if (!hasSubdomain("appsec")) suggestions.push("Add app security tools (OWASP, SAST) for code scanning.");
      if (!hasSubdomain("cloudsec")) suggestions.push("Include cloud security components (IAM, KMS) for protection.");
      if (!hasSubdomain("monitoring")) suggestions.push("Pick monitoring/security tools (SIEM) to detect threats.");
      break;

    default:
      if (picked.length) roleHints.push("Generalist Engineer");
      break;
  }

  const compatibilityScore = Math.max(
    0,
    Math.min(
      100,
      Math.round((agg.performance + agg.scalability + agg.demand) * 3 + (ok ? 10 : -10) - warnings.length * 5)
    )
  );

  const distribution = {};
  for (const p of picked) distribution[p.subdomain] = (distribution[p.subdomain] || 0) + 1;

  return {
    picked,
    aggregateScores: agg,
    warnings,
    suggestions,
    compatibilityScore,
    roleHints,
    distribution,
    viable: ok
  };
}
