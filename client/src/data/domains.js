export const DOMAIN_DATA = {
  web: {
    title: "Web Development",
    skills: [
      { name: "HTML/CSS", steps: ["Semantic HTML", "Flexbox/Grid", "Responsive design"] },
      { name: "JavaScript", steps: ["ES6+", "Modules", "Async/Await"] },
      { name: "React", steps: ["Components", "Hooks", "Routing"] },
    ],
  },
  cloud: {
    title: "Cloud",
    skills: [
      { name: "Foundations", steps: ["Cloud models", "IAM basics", "Regions & AZs"] },
      { name: "Containers", steps: ["Docker basics", "Images", "Compose", "Kubernetes intro"] },
      { name: "Serverless", steps: ["FaaS basics", "Deploying functions", "Monitoring usage"] },
    ],
  },
  mobile: {
    title: "Mobile Development",
    skills: [
      { name: "Platform Fundamentals", steps: ["iOS basics", "Android basics", "Cross-platform"] },
      { name: "UI/UX", steps: ["Design principles", "Navigation", "Accessibility"] },
      { name: "Performance", steps: ["Profiling", "Memory management", "Battery optimization"] },
    ],
  },
  database: {
    title: "Database Management",
    skills: [
      { name: "SQL", steps: ["Query language", "Joins", "Indexes"] },
      { name: "NoSQL", steps: ["Key-value stores", "Document databases", "Wide column stores"] },
      { name: "Design & Optimization", steps: ["Normalization", "Replication", "Backup strategies"] },
    ],
  },
  devops: {
    title: "DevOps",
    skills: [
      { name: "Infrastructure", steps: ["Terraform", "Provisioning", "Cloud providers"] },
      { name: "CI/CD", steps: ["Pipelines", "Testing", "Deployment"] },
      { name: "Monitoring", steps: ["Logging", "Alerting", "Metrics"] },
    ],
  },
  security: {
    title: "Security",
    skills: [
      { name: "Basics", steps: ["OWASP Top 10", "Authentication", "Authorization"] },
      { name: "Network Security", steps: ["TLS/SSL", "Firewalls", "VPNs"] },
      { name: "Application Security", steps: ["Static analysis", "Penetration testing", "Patch management"] },
    ],
  },
};

export const DOMAIN_LIST = Object.entries(DOMAIN_DATA).map(([slug, obj]) => ({
  slug,
  title: obj.title,
  skills: obj.skills,
}));