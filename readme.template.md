# Projects Manager

This repository is created for personal use as a tool for quickly deploying and testing projects.

The workflow is based on pushing different projects to separate branches in this repository. Each branch represents a standalone project, which is automatically deployed on the server into a dedicated folder under `/var/www/projects/<branch-name>`.

## Automation and Infrastructure

- **Automated Deployment**: On every push to a branch, a deployment script automatically installs dependencies, builds (if necessary), and starts the project using PM2.

- **Wildcard Domains**: A wildcard DNS record is set up for `*.projects.do-code.com`, allowing every project to be accessed at a unique subdomain like `project-name.projects.do-code.com`.

- **SSL Certificates**: Certificates are configured with Cloudflare DNS API for automated issuance and renewal. This ensures that every project subdomain is available over HTTPS.

- **NGINX Configuration**: A single NGINX server block is configured with a wildcard `server_name` to proxy requests to projects in `/var/www/projects`. This setup automatically serves all projects without requiring manual changes to the NGINX configuration for each new deployment.

## Notes

Each project should include a `deploy.sh` script or equivalent to define its deployment steps.

This setup simplifies testing, deployment, and hosting of multiple projects in an isolated yet unified environment.

! This project is built specifically for my internal workflows and is not intended for production use by others.

## Projects
{{projects}}