export const STACK_SCHEMA = {
  web: {
    title: "Web Development",
    order: ["frontend", "backend", "database", "cloud"],
    subdomains: {
      frontend: {
        title: "Frontend",
        order: ["framework", "styling", "build"],
        components: {
          framework: {
            type: "framework",
            title: "Framework",
            multi: false,
            tools: [
              { id: "react", name: "React", tags: ["frontend", "js"], scores: { performance: 7, scalability: 7, learning: 5, demand: 10 } },
              { id: "nextjs", name: "Next.js", tags: ["frontend", "node", "ssr"], scores: { performance: 8, scalability: 8, learning: 6, demand: 9 } },
              { id: "vue", name: "Vue", tags: ["frontend", "js"], scores: { performance: 7, scalability: 6, learning: 6, demand: 7 } }
            ]
          },
          styling: {
            type: "styling",
            title: "Styling",
            multi: true,
            tools: [
              { id: "tailwind", name: "Tailwind CSS", tags: ["css"], scores: { performance: 8, scalability: 7, learning: 6, demand: 9 } },
              { id: "sass", name: "Sass", tags: ["css"], scores: { performance: 6, scalability: 6, learning: 5, demand: 6 } }
            ]
          },
          build: {
            type: "build",
            title: "Build Tool",
            multi: false,
            tools: [
              { id: "vite", name: "Vite", tags: ["build"], scores: { performance: 9, scalability: 7, learning: 6, demand: 8 } },
              { id: "webpack", name: "Webpack", tags: ["build"], scores: { performance: 7, scalability: 8, learning: 5, demand: 7 } }
            ]
          }
        }
      },
      backend: {
        title: "Backend",
        order: ["runtime", "framework"],
        components: {
          runtime: {
            type: "runtime",
            title: "Runtime",
            multi: false,
            tools: [
              { id: "node", name: "Node.js", tags: ["backend", "node"], scores: { performance: 7, scalability: 8, learning: 6, demand: 10 } },
              { id: "python", name: "Python", tags: ["backend", "py"], scores: { performance: 6, scalability: 7, learning: 7, demand: 9 } }
            ]
          },
          framework: {
            type: "server-framework",
            title: "Server Framework",
            multi: false,
            tools: [
              { id: "express", name: "Express", tags: ["node"], scores: { performance: 7, scalability: 7, learning: 6, demand: 10 } },
              { id: "nest", name: "NestJS", tags: ["node"], scores: { performance: 8, scalability: 8, learning: 6, demand: 8 } },
              { id: "django", name: "Django", tags: ["py"], scores: { performance: 7, scalability: 8, learning: 6, demand: 8 } }
            ]
          }
        }
      },
      database: {
        title: "Database",
        order: ["engine", "orm"],
        components: {
          engine: {
            type: "db",
            title: "DB Engine",
            multi: false,
            tools: [
              { id: "postgres", name: "PostgreSQL", tags: ["sql", "db"], scores: { performance: 8, scalability: 8, learning: 6, demand: 10 } },
              { id: "mysql", name: "MySQL", tags: ["sql", "db"], scores: { performance: 7, scalability: 7, learning: 6, demand: 9 } },
              { id: "mongo", name: "MongoDB", tags: ["nosql", "db"], scores: { performance: 7, scalability: 8, learning: 6, demand: 9 } }
            ]
          },
          orm: {
            type: "orm",
            title: "ORM",
            multi: false,
            tools: [
              { id: "prisma", name: "Prisma", tags: ["orm", "node"], scores: { performance: 7, scalability: 7, learning: 7, demand: 9 } },
              { id: "sequelize", name: "Sequelize", tags: ["orm", "node"], scores: { performance: 6, scalability: 6, learning: 6, demand: 7 } }
            ]
          }
        }
      },
      cloud: {
        title: "Cloud & Deploy",
        order: ["provider", "cicd"],
        components: {
          provider: {
            type: "cloud",
            title: "Provider",
            multi: false,
            tools: [
              { id: "aws", name: "AWS", tags: ["cloud"], scores: { performance: 9, scalability: 10, learning: 7, demand: 10 } },
              { id: "vercel", name: "Vercel", tags: ["cloud", "serverless"], scores: { performance: 8, scalability: 8, learning: 8, demand: 9 } },
              { id: "render", name: "Render", tags: ["cloud"], scores: { performance: 7, scalability: 7, learning: 8, demand: 7 } }
            ]
          },
          cicd: {
            type: "cicd",
            title: "CI/CD",
            multi: true,
            tools: [
              { id: "gha", name: "GitHub Actions", tags: ["cicd"], scores: { performance: 8, scalability: 8, learning: 7, demand: 9 } },
              { id: "vercel-deploy", name: "Vercel Deploy", tags: ["cicd", "vercel"], scores: { performance: 8, scalability: 8, learning: 9, demand: 9 } }
            ]
          }
        }
      }
    }
  },

  cloud: {
    title: "Cloud Computing",
    order: ["compute", "storage", "network"],
    subdomains: {
      compute: {
        title: "Compute",
        order: ["virtual-machines", "containers"],
        components: {
          "virtual-machines": {
            type: "virtual-machines",
            title: "Virtual Machines",
            multi: false,
            tools: [
              { id: "ec2", name: "Amazon EC2", tags: ["compute", "vm", "aws"], scores: { performance: 8, scalability: 9, learning: 6, demand: 9 } },
              { id: "azure-vm", name: "Azure Virtual Machines", tags: ["compute", "vm", "azure"], scores: { performance: 8, scalability: 8, learning: 6, demand: 8 } }
            ]
          },
          containers: {
            type: "containers",
            title: "Containers",
            multi: true,
            tools: [
              { id: "docker", name: "Docker", tags: ["containers"], scores: { performance: 8, scalability: 8, learning: 7, demand: 9 } },
              { id: "kubernetes", name: "Kubernetes", tags: ["containers", "orchestration"], scores: { performance: 9, scalability: 9, learning: 9, demand: 9 } }
            ]
          }
        }
      },
      storage: {
        title: "Storage",
        order: ["object-storage", "block-storage"],
        components: {
          "object-storage": {
            type: "object-storage",
            title: "Object Storage",
            multi: false,
            tools: [
              { id: "s3", name: "Amazon S3", tags: ["storage", "object"], scores: { performance: 9, scalability: 10, learning: 7, demand: 10 } },
              { id: "azure-blob", name: "Azure Blob Storage", tags: ["storage", "object"], scores: { performance: 9, scalability: 9, learning: 7, demand: 9 } }
            ]
          },
          "block-storage": {
            type: "block-storage",
            title: "Block Storage",
            multi: false,
            tools: [
              { id: "ebs", name: "Amazon EBS", tags: ["storage", "block"], scores: { performance: 9, scalability: 8, learning: 7, demand: 9 } },
              { id: "azure-disk", name: "Azure Disk Storage", tags: ["storage", "block"], scores: { performance: 9, scalability: 8, learning: 6, demand: 8 } }
            ]
          }
        }
      },
      network: {
        title: "Networking",
        order: ["vpc", "dns"],
        components: {
          vpc: {
            type: "vpc",
            title: "Virtual Private Cloud",
            multi: false,
            tools: [
              { id: "aws-vpc", name: "AWS VPC", tags: ["network"], scores: { performance: 8, scalability: 9, learning: 6, demand: 9 } }
            ]
          },
          dns: {
            type: "dns",
            title: "DNS Management",
            multi: false,
            tools: [
              { id: "route53", name: "Amazon Route 53", tags: ["network", "dns"], scores: { performance: 9, scalability: 9, learning: 7, demand: 9 } }
            ]
          }
        }
      }
    }
  },

  mobile: {
    title: "Mobile Development",
    order: ["framework", "language", "testing"],
    subdomains: {
      framework: {
        title: "Frameworks",
        order: ["cross-platform", "native"],
        components: {
          "cross-platform": {
            type: "cross-framework",
            title: "Cross Platform",
            multi: false,
            tools: [
              { id: "react-native", name: "React Native", tags: ["mobile", "cross"], scores: { performance: 8, scalability: 7, learning: 6, demand: 9 } },
              { id: "flutter", name: "Flutter", tags: ["mobile", "cross"], scores: { performance: 8, scalability: 8, learning: 7, demand: 9 } }
            ]
          },
          native: {
            type: "native-framework",
            title: "Native SDKs",
            multi: false,
            tools: [
              { id: "android-sdk", name: "Android SDK", tags: ["mobile", "android"], scores: { performance: 8, scalability: 8, learning: 6, demand: 9 } },
              { id: "swiftui", name: "SwiftUI", tags: ["mobile", "ios"], scores: { performance: 8, scalability: 8, learning: 6, demand: 8 } }
            ]
          }
        }
      },
      language: {
        title: "Languages",
        order: ["mobile-langs"],
        components: {
          "mobile-langs": {
            type: "languages",
            title: "Languages",
            multi: true,
            tools: [
              { id: "kotlin", name: "Kotlin", tags: ["mobile", "android"], scores: { performance: 8, scalability: 8, learning: 7, demand: 9 } },
              { id: "swift", name: "Swift", tags: ["mobile", "ios"], scores: { performance: 8, scalability: 8, learning: 7, demand: 8 } },
              { id: "dart", name: "Dart", tags: ["mobile", "cross"], scores: { performance: 7, scalability: 7, learning: 6, demand: 8 } }
            ]
          }
        }
      },
      testing: {
        title: "Testing",
        order: ["mobile-testing"],
        components: {
          "mobile-testing": {
            type: "testing",
            title: "Testing Tools",
            multi: true,
            tools: [
              { id: "junit", name: "JUnit", tags: ["test"], scores: { performance: 7, scalability: 7, learning: 6, demand: 8 } },
              { id: "espresso", name: "Espresso", tags: ["android", "test"], scores: { performance: 7, scalability: 6, learning: 6, demand: 7 } },
              { id: "xctest", name: "XCTest", tags: ["ios", "test"], scores: { performance: 7, scalability: 7, learning: 6, demand: 7 } }
            ]
          }
        }
      }
    }
  },

  database: {
    title: "Database Management",
    order: ["engines", "tools"],
    subdomains: {
      engines: {
        title: "DB Engines",
        order: ["sql", "nosql"],
        components: {
          sql: {
            type: "sql-db",
            title: "SQL Databases",
            multi: false,
            tools: [
              { id: "postgres", name: "PostgreSQL", tags: ["sql", "db"], scores: { performance: 8, scalability: 8, learning: 6, demand: 10 } },
              { id: "mysql", name: "MySQL", tags: ["sql", "db"], scores: { performance: 7, scalability: 7, learning: 6, demand: 9 } },
              { id: "mssql", name: "SQL Server", tags: ["sql", "db"], scores: { performance: 7, scalability: 7, learning: 6, demand: 8 } }
            ]
          },
          nosql: {
            type: "nosql-db",
            title: "NoSQL Databases",
            multi: false,
            tools: [
              { id: "mongo", name: "MongoDB", tags: ["nosql", "db"], scores: { performance: 7, scalability: 8, learning: 6, demand: 9 } },
              { id: "redis", name: "Redis", tags: ["nosql", "cache"], scores: { performance: 9, scalability: 8, learning: 6, demand: 9 } },
              { id: "cassandra", name: "Cassandra", tags: ["nosql"], scores: { performance: 8, scalability: 9, learning: 7, demand: 7 } }
            ]
          }
        }
      },
      tools: {
        title: "DB Tools",
        order: ["orm", "analytics"],
        components: {
          orm: {
            type: "orm",
            title: "ORM Tools",
            multi: false,
            tools: [
              { id: "prisma", name: "Prisma", tags: ["orm"], scores: { performance: 7, scalability: 7, learning: 7, demand: 9 } },
              { id: "sequelize", name: "Sequelize", tags: ["orm"], scores: { performance: 6, scalability: 6, learning: 6, demand: 7 } }
            ]
          },
          analytics: {
            type: "analytics",
            title: "Analytics",
            multi: true,
            tools: [
              { id: "metabase", name: "Metabase", tags: ["analytics"], scores: { performance: 7, scalability: 7, learning: 7, demand: 7 } },
              { id: "superset", name: "Apache Superset", tags: ["analytics"], scores: { performance: 8, scalability: 8, learning: 7, demand: 8 } }
            ]
          }
        }
      }
    }
  },

  devops: {
    title: "DevOps",
    order: ["ci-cd", "containers", "monitoring"],
    subdomains: {
      "ci-cd": {
        title: "CI/CD",
        order: ["pipeline"],
        components: {
          pipeline: {
            type: "pipeline",
            title: "Pipelines",
            multi: true,
            tools: [
              { id: "gha", name: "GitHub Actions", tags: ["cicd"], scores: { performance: 8, scalability: 8, learning: 7, demand: 9 } },
              { id: "gitlab-ci", name: "GitLab CI", tags: ["cicd"], scores: { performance: 8, scalability: 8, learning: 7, demand: 8 } },
              { id: "jenkins", name: "Jenkins", tags: ["cicd"], scores: { performance: 7, scalability: 8, learning: 6, demand: 8 } }
            ]
          }
        }
      },
      containers: {
        title: "Containers & Orchestration",
        order: ["docker", "kubernetes"],
        components: {
          docker: {
            type: "container",
            title: "Docker",
            multi: false,
            tools: [
              { id: "docker", name: "Docker", tags: ["containers"], scores: { performance: 8, scalability: 8, learning: 7, demand: 9 } }
            ]
          },
          kubernetes: {
            type: "orchestration",
            title: "Kubernetes",
            multi: false,
            tools: [
              { id: "k8s", name: "Kubernetes", tags: ["orchestration"], scores: { performance: 9, scalability: 9, learning: 9, demand: 9 } }
            ]
          }
        }
      },
      monitoring: {
        title: "Monitoring & Logging",
        order: ["tools"],
        components: {
          tools: {
            type: "monitoring",
            title: "Monitoring Tools",
            multi: true,
            tools: [
              { id: "prometheus", name: "Prometheus", tags: ["monitoring"], scores: { performance: 9, scalability: 9, learning: 7, demand: 9 } },
              { id: "grafana", name: "Grafana", tags: ["monitoring"], scores: { performance: 9, scalability: 9, learning: 7, demand: 9 } },
              { id: "elk", name: "ELK Stack", tags: ["logging"], scores: { performance: 8, scalability: 8, learning: 8, demand: 8 } }
            ]
          }
        }
      }
    }
  },

  security: {
    title: "Security",
    order: ["appsec", "cloudsec", "monitoring"],
    subdomains: {
      appsec: {
        title: "Application Security",
        order: ["tools"],
        components: {
          tools: {
            type: "appsec",
            title: "App Security Tools",
            multi: true,
            tools: [
              { id: "owasp-zap", name: "OWASP ZAP", tags: ["security"], scores: { performance: 7, scalability: 7, learning: 7, demand: 7 } },
              { id: "burpsuite", name: "Burp Suite", tags: ["security"], scores: { performance: 8, scalability: 8, learning: 8, demand: 8 } }
            ]
          }
        }
      },
      cloudsec: {
        title: "Cloud Security",
        order: ["iam"],
        components: {
          iam: {
            type: "iam",
            title: "Identity & Access Management",
            multi: false,
            tools: [
              { id: "aws-iam", name: "AWS IAM", tags: ["cloud", "security"], scores: { performance: 9, scalability: 9, learning: 7, demand: 9 } },
              { id: "azure-ad", name: "Azure AD", tags: ["cloud", "security"], scores: { performance: 8, scalability: 8, learning: 7, demand: 8 } }
            ]
          }
        }
      },
      monitoring: {
        title: "Security Monitoring",
        order: ["tools"],
        components: {
          tools: {
            type: "sec-monitoring",
            title: "Security Monitoring Tools",
            multi: true,
            tools: [
              { id: "splunk", name: "Splunk", tags: ["security", "monitoring"], scores: { performance: 8, scalability: 9, learning: 8, demand: 9 } },
              { id: "wazuh", name: "Wazuh", tags: ["security", "monitoring"], scores: { performance: 7, scalability: 8, learning: 7, demand: 7 } }
            ]
          }
        }
      }
    }
  }
};
