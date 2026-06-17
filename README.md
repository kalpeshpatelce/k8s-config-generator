# ⎈ K8s Config Generator

A web-based Kubernetes configuration file generator. Create production-ready YAML manifests and kubectl commands through an intuitive split-screen interface.

**Live Demo:** Deploy this to GitHub Pages and access it from any browser.

## Features

- **14 Resource Types** — Pod, Deployment, Service, ReplicaSet, StatefulSet, DaemonSet, Job, CronJob, Ingress, ConfigMap, Secret, PVC, HPA, NetworkPolicy
- **Real-time Preview** — YAML updates as you type
- **kubectl Commands** — Auto-generated commands for apply, get, describe, logs, exec, port-forward, scale, rollout, and delete
- **Syntax Highlighting** — Color-coded YAML output
- **Presets** — Quick-start templates for common workloads
- **Copy & Download** — One-click copy or download for individual or combined YAML
- **LocalStorage** — Form state persists across sessions
- **Dark Theme** — Developer-friendly dark UI
- **No Dependencies** — Pure HTML, CSS, and JavaScript (no build tools required)

## Project Structure

```
├── index.html          # Main page
├── css/
│   └── style.css       # Dark theme styling
├── js/
│   ├── app.js          # Application logic, UI interactions
│   ├── generators.js   # YAML generation functions
│   └── commands.js     # kubectl command generation
└── README.md           # This file
```

## Deploying to GitHub Pages

### Option 1: Deploy from main branch

1. Push this repository to GitHub:
   ```bash
   git init
   git add .
   git commit -m "Initial commit: K8s Config Generator"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/k8s-config-generator.git
   git push -u origin main
   ```

2. Go to your repository on GitHub

3. Navigate to **Settings** → **Pages**

4. Under "Source", select **Deploy from a branch**

5. Choose **main** branch and **/ (root)** folder

6. Click **Save**

7. Your site will be live at:
   ```
   https://YOUR_USERNAME.github.io/k8s-config-generator/
   ```

### Option 2: Deploy with GitHub Actions

1. Push the repository to GitHub (same as above)

2. Go to **Settings** → **Pages**

3. Under "Source", select **GitHub Actions**

4. GitHub will automatically detect the static site and deploy it

### Custom Domain (Optional)

1. Go to **Settings** → **Pages**
2. Under "Custom domain", enter your domain (e.g., `k8s.yourdomain.com`)
3. Add a CNAME record in your DNS pointing to `YOUR_USERNAME.github.io`
4. Enable "Enforce HTTPS"

## Usage

1. **Fill in Basic Configuration** — Docker image and app name are required
2. **Select Resource Types** — Check which Kubernetes resources to generate
3. **Configure Options** — Set resource limits, probes, env vars, volumes, etc.
4. **View Output** — Switch between Combined YAML, individual resources, or kubectl commands
5. **Copy or Download** — Use the toolbar buttons to copy or download YAML files

### Presets

Use the "Load Preset" dropdown to quickly populate the form:
- **Simple Web App** — Nginx deployment with service
- **Redis Cache** — Redis with ClusterIP service
- **PostgreSQL StatefulSet** — Postgres with PVC and secrets
- **Nginx with Ingress** — Full ingress setup
- **CronJob Backup** — Scheduled backup job

## Supported Kubernetes Platforms

Generated YAML is compatible with:
- Amazon EKS
- Google GKE
- Azure AKS
- minikube
- k3s / k3d
- kind
- Docker Desktop Kubernetes
- Any conformant Kubernetes cluster

## API Versions Used

| Resource | apiVersion |
|----------|-----------|
| Pod | v1 |
| Deployment | apps/v1 |
| Service | v1 |
| ReplicaSet | apps/v1 |
| StatefulSet | apps/v1 |
| DaemonSet | apps/v1 |
| Job | batch/v1 |
| CronJob | batch/v1 |
| Ingress | networking.k8s.io/v1 |
| ConfigMap | v1 |
| Secret | v1 |
| PVC | v1 |
| HPA | autoscaling/v2 |
| NetworkPolicy | networking.k8s.io/v1 |

## Local Development

No build tools needed. Just open `index.html` in your browser:

```bash
# Using Python
python -m http.server 8000

# Using Node.js
npx serve .

# Using PHP
php -S localhost:8000

# Or just open index.html directly in your browser
```

## License

MIT
