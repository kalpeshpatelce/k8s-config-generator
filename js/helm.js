/**
 * K8s Config Generator - Helm Chart Guide & Generator
 * Provides step-by-step Helm chart creation, packaging, and deployment commands.
 * Also generates Helm chart files from the current configuration.
 */

function generateHelmGuide() {
    const data = getFormData();
    const name = data.name || 'my-app';
    const ns = data.namespace || 'default';
    const image = data.image || 'nginx:latest';
    const [imageRepo, imageTag] = image.includes(':') ? image.split(':') : [image, 'latest'];

    let html = '';

    // Step 1: Prerequisites
    html += `<div class="helm-section">`;
    html += `<h3>Step 1: Install Helm</h3>`;
    html += `<p class="helm-desc">Install Helm CLI on your system:</p>`;
    html += `<span class="kubectl-cmd" onclick="copyCommand(this)">curl https://raw.githubusercontent.com/helm/helm/main/scripts/get-helm-3 | bash</span>`;
    html += `<span class="kubectl-cmd" onclick="copyCommand(this)">helm version</span>`;
    html += `<p class="helm-desc">Windows (Chocolatey):</p>`;
    html += `<span class="kubectl-cmd" onclick="copyCommand(this)">choco install kubernetes-helm</span>`;
    html += `<p class="helm-desc">macOS (Homebrew):</p>`;
    html += `<span class="kubectl-cmd" onclick="copyCommand(this)">brew install helm</span>`;
    html += `</div>`;

    // Step 2: Create chart
    html += `<div class="helm-section">`;
    html += `<h3>Step 2: Create Helm Chart</h3>`;
    html += `<p class="helm-desc">Scaffold a new Helm chart:</p>`;
    html += `<span class="kubectl-cmd" onclick="copyCommand(this)">helm create ${name}</span>`;
    html += `<p class="helm-desc">This creates the following structure:</p>`;
    html += `<pre class="helm-tree">`;
    html += `${name}/\n`;
    html += `├── Chart.yaml          # Chart metadata\n`;
    html += `├── values.yaml         # Default configuration values\n`;
    html += `├── charts/             # Dependencies\n`;
    html += `├── templates/          # Kubernetes manifests (Go templates)\n`;
    html += `│   ├── deployment.yaml\n`;
    html += `│   ├── service.yaml\n`;
    html += `│   ├── ingress.yaml\n`;
    html += `│   ├── hpa.yaml\n`;
    html += `│   ├── serviceaccount.yaml\n`;
    html += `│   ├── _helpers.tpl    # Template helpers\n`;
    html += `│   ├── NOTES.txt       # Post-install notes\n`;
    html += `│   └── tests/\n`;
    html += `│       └── test-connection.yaml\n`;
    html += `└── .helmignore         # Files to ignore\n`;
    html += `</pre>`;
    html += `</div>`;

    // Step 3: Chart.yaml
    html += `<div class="helm-section">`;
    html += `<h3>Step 3: Chart.yaml</h3>`;
    html += `<p class="helm-desc">Edit Chart.yaml with your chart metadata:</p>`;
    html += `<pre class="helm-code"><code>`;
    html += `apiVersion: v2\n`;
    html += `name: ${name}\n`;
    html += `description: A Helm chart for ${name}\n`;
    html += `type: application\n`;
    html += `version: 0.1.0\n`;
    html += `appVersion: "${imageTag}"\n`;
    html += `maintainers:\n`;
    html += `  - name: your-name\n`;
    html += `    email: your-email@example.com\n`;
    html += `keywords:\n`;
    html += `  - ${name}\n`;
    html += `  - kubernetes\n`;
    html += `</code></pre>`;
    html += `</div>`;

    // Step 4: values.yaml
    html += `<div class="helm-section">`;
    html += `<h3>Step 4: values.yaml (Generated from your config)</h3>`;
    html += `<p class="helm-desc">This is auto-generated from your current form inputs:</p>`;
    html += `<pre class="helm-code"><code>`;
    html += generateValuesYaml(data, imageRepo, imageTag);
    html += `</code></pre>`;
    html += `</div>`;

    // Step 5: Templates
    html += `<div class="helm-section">`;
    html += `<h3>Step 5: templates/deployment.yaml</h3>`;
    html += `<p class="helm-desc">Templatized deployment manifest:</p>`;
    html += `<pre class="helm-code"><code>`;
    html += generateHelmDeploymentTemplate(name);
    html += `</code></pre>`;
    html += `</div>`;

    // Step 5b: Service template
    html += `<div class="helm-section">`;
    html += `<h3>Step 5b: templates/service.yaml</h3>`;
    html += `<pre class="helm-code"><code>`;
    html += generateHelmServiceTemplate();
    html += `</code></pre>`;
    html += `</div>`;

    // Step 6: Lint & Validate
    html += `<div class="helm-section">`;
    html += `<h3>Step 6: Lint & Validate Chart</h3>`;
    html += `<span class="kubectl-cmd" onclick="copyCommand(this)">helm lint ./${name}</span>`;
    html += `<span class="kubectl-cmd" onclick="copyCommand(this)">helm template ${name} ./${name} --debug</span>`;
    html += `<span class="kubectl-cmd" onclick="copyCommand(this)">helm template ${name} ./${name} --dry-run > rendered.yaml</span>`;
    html += `</div>`;

    // Step 7: Install
    html += `<div class="helm-section">`;
    html += `<h3>Step 7: Install / Upgrade Chart</h3>`;
    html += `<p class="helm-desc">Install the chart to your cluster:</p>`;
    html += `<span class="kubectl-cmd" onclick="copyCommand(this)">helm install ${name} ./${name} -n ${ns} --create-namespace</span>`;
    html += `<span class="kubectl-cmd" onclick="copyCommand(this)">helm upgrade --install ${name} ./${name} -n ${ns} --create-namespace</span>`;
    html += `<p class="helm-desc">Install with custom values:</p>`;
    html += `<span class="kubectl-cmd" onclick="copyCommand(this)">helm install ${name} ./${name} -n ${ns} -f custom-values.yaml</span>`;
    html += `<span class="kubectl-cmd" onclick="copyCommand(this)">helm install ${name} ./${name} -n ${ns} --set image.tag=v2.0.0</span>`;
    html += `<span class="kubectl-cmd" onclick="copyCommand(this)">helm install ${name} ./${name} -n ${ns} --set replicaCount=3</span>`;
    html += `</div>`;

    // Step 8: Package
    html += `<div class="helm-section">`;
    html += `<h3>Step 8: Package Chart</h3>`;
    html += `<p class="helm-desc">Package your chart into a .tgz archive:</p>`;
    html += `<span class="kubectl-cmd" onclick="copyCommand(this)">helm package ./${name}</span>`;
    html += `<span class="kubectl-cmd" onclick="copyCommand(this)">helm package ./${name} --version 0.1.0 --app-version ${imageTag}</span>`;
    html += `<span class="kubectl-cmd" onclick="copyCommand(this)">helm package ./${name} -d ./charts-repo/</span>`;
    html += `</div>`;

    // Step 9: Push to Registry
    html += `<div class="helm-section">`;
    html += `<h3>Step 9: Push to Helm Registry</h3>`;
    html += `<p class="helm-desc">Push to OCI-compatible registry (Docker Hub, ECR, GCR, ACR):</p>`;
    html += `<span class="kubectl-cmd" onclick="copyCommand(this)">helm registry login registry-1.docker.io</span>`;
    html += `<span class="kubectl-cmd" onclick="copyCommand(this)">helm push ${name}-0.1.0.tgz oci://registry-1.docker.io/YOUR_USERNAME</span>`;
    html += `<p class="helm-desc">AWS ECR:</p>`;
    html += `<span class="kubectl-cmd" onclick="copyCommand(this)">aws ecr get-login-password --region us-east-1 | helm registry login --username AWS --password-stdin ACCOUNT.dkr.ecr.us-east-1.amazonaws.com</span>`;
    html += `<span class="kubectl-cmd" onclick="copyCommand(this)">helm push ${name}-0.1.0.tgz oci://ACCOUNT.dkr.ecr.us-east-1.amazonaws.com/</span>`;
    html += `<p class="helm-desc">GitHub Container Registry (GHCR):</p>`;
    html += `<span class="kubectl-cmd" onclick="copyCommand(this)">echo $GITHUB_TOKEN | helm registry login ghcr.io -u YOUR_USERNAME --password-stdin</span>`;
    html += `<span class="kubectl-cmd" onclick="copyCommand(this)">helm push ${name}-0.1.0.tgz oci://ghcr.io/YOUR_USERNAME/charts</span>`;
    html += `<p class="helm-desc">ChartMuseum (self-hosted):</p>`;
    html += `<span class="kubectl-cmd" onclick="copyCommand(this)">helm repo add myrepo http://chartmuseum.example.com</span>`;
    html += `<span class="kubectl-cmd" onclick="copyCommand(this)">curl --data-binary "@${name}-0.1.0.tgz" http://chartmuseum.example.com/api/charts</span>`;
    html += `</div>`;

    // Step 10: Install from registry
    html += `<div class="helm-section">`;
    html += `<h3>Step 10: Install from Registry</h3>`;
    html += `<span class="kubectl-cmd" onclick="copyCommand(this)">helm install ${name} oci://registry-1.docker.io/YOUR_USERNAME/${name} --version 0.1.0 -n ${ns}</span>`;
    html += `<span class="kubectl-cmd" onclick="copyCommand(this)">helm pull oci://registry-1.docker.io/YOUR_USERNAME/${name} --version 0.1.0</span>`;
    html += `</div>`;

    // Step 11: Manage releases
    html += `<div class="helm-section">`;
    html += `<h3>Step 11: Manage Helm Releases</h3>`;
    html += `<span class="kubectl-cmd" onclick="copyCommand(this)">helm list -n ${ns}</span>`;
    html += `<span class="kubectl-cmd" onclick="copyCommand(this)">helm status ${name} -n ${ns}</span>`;
    html += `<span class="kubectl-cmd" onclick="copyCommand(this)">helm history ${name} -n ${ns}</span>`;
    html += `<span class="kubectl-cmd" onclick="copyCommand(this)">helm get values ${name} -n ${ns}</span>`;
    html += `<span class="kubectl-cmd" onclick="copyCommand(this)">helm get manifest ${name} -n ${ns}</span>`;
    html += `<span class="kubectl-cmd" onclick="copyCommand(this)">helm rollback ${name} 1 -n ${ns}</span>`;
    html += `<span class="kubectl-cmd" onclick="copyCommand(this)">helm uninstall ${name} -n ${ns}</span>`;
    html += `</div>`;

    // Step 12: Dependencies
    html += `<div class="helm-section">`;
    html += `<h3>Step 12: Chart Dependencies</h3>`;
    html += `<p class="helm-desc">Add dependencies in Chart.yaml:</p>`;
    html += `<pre class="helm-code"><code>`;
    html += `dependencies:\n`;
    html += `  - name: postgresql\n`;
    html += `    version: "12.x.x"\n`;
    html += `    repository: "https://charts.bitnami.com/bitnami"\n`;
    html += `    condition: postgresql.enabled\n`;
    html += `  - name: redis\n`;
    html += `    version: "17.x.x"\n`;
    html += `    repository: "https://charts.bitnami.com/bitnami"\n`;
    html += `    condition: redis.enabled\n`;
    html += `</code></pre>`;
    html += `<span class="kubectl-cmd" onclick="copyCommand(this)">helm dependency update ./${name}</span>`;
    html += `<span class="kubectl-cmd" onclick="copyCommand(this)">helm dependency build ./${name}</span>`;
    html += `<span class="kubectl-cmd" onclick="copyCommand(this)">helm dependency list ./${name}</span>`;
    html += `</div>`;

    // Step 13: Repo management
    html += `<div class="helm-section">`;
    html += `<h3>Step 13: Helm Repository Management</h3>`;
    html += `<span class="kubectl-cmd" onclick="copyCommand(this)">helm repo add bitnami https://charts.bitnami.com/bitnami</span>`;
    html += `<span class="kubectl-cmd" onclick="copyCommand(this)">helm repo add ingress-nginx https://kubernetes.github.io/ingress-nginx</span>`;
    html += `<span class="kubectl-cmd" onclick="copyCommand(this)">helm repo add jetstack https://charts.jetstack.io</span>`;
    html += `<span class="kubectl-cmd" onclick="copyCommand(this)">helm repo update</span>`;
    html += `<span class="kubectl-cmd" onclick="copyCommand(this)">helm repo list</span>`;
    html += `<span class="kubectl-cmd" onclick="copyCommand(this)">helm search repo bitnami</span>`;
    html += `<span class="kubectl-cmd" onclick="copyCommand(this)">helm search hub ${name}</span>`;
    html += `</div>`;

    // GitHub Pages as Helm repo
    html += `<div class="helm-section">`;
    html += `<h3>Step 14: Host Helm Repo on GitHub Pages</h3>`;
    html += `<p class="helm-desc">Create an index for your packaged charts:</p>`;
    html += `<span class="kubectl-cmd" onclick="copyCommand(this)">helm package ./${name}</span>`;
    html += `<span class="kubectl-cmd" onclick="copyCommand(this)">helm repo index . --url https://YOUR_USERNAME.github.io/helm-charts/</span>`;
    html += `<p class="helm-desc">Then push the .tgz and index.yaml to the gh-pages branch. Users install via:</p>`;
    html += `<span class="kubectl-cmd" onclick="copyCommand(this)">helm repo add myrepo https://YOUR_USERNAME.github.io/helm-charts/</span>`;
    html += `<span class="kubectl-cmd" onclick="copyCommand(this)">helm install ${name} myrepo/${name}</span>`;
    html += `</div>`;

    return html;
}

// ===== Generate values.yaml from current config =====

function generateValuesYaml(data, imageRepo, imageTag) {
    let yaml = '';
    yaml += `# Default values for ${data.name}\n`;
    yaml += `replicaCount: ${data.replicas}\n\n`;
    yaml += `image:\n`;
    yaml += `  repository: ${imageRepo}\n`;
    yaml += `  pullPolicy: ${data.imagePullPolicy}\n`;
    yaml += `  tag: "${imageTag}"\n\n`;
    yaml += `nameOverride: ""\n`;
    yaml += `fullnameOverride: "${data.name}"\n\n`;

    yaml += `serviceAccount:\n`;
    yaml += `  create: true\n`;
    yaml += `  name: "${data.serviceAccountName || ''}"\n\n`;

    yaml += `service:\n`;
    yaml += `  type: ${data.serviceType}\n`;
    yaml += `  port: ${data.containerPort || 80}\n`;
    if (data.nodePort) yaml += `  nodePort: ${data.nodePort}\n`;
    yaml += `\n`;

    yaml += `ingress:\n`;
    yaml += `  enabled: ${getSelectedResources().includes('ingress')}\n`;
    yaml += `  className: "${data.ingressClass}"\n`;
    yaml += `  hosts:\n`;
    yaml += `    - host: ${data.ingressHost || 'chart-example.local'}\n`;
    yaml += `      paths:\n`;
    yaml += `        - path: ${data.ingressPath}\n`;
    yaml += `          pathType: ${data.pathType}\n`;
    if (data.tlsSecretName) {
        yaml += `  tls:\n`;
        yaml += `    - secretName: ${data.tlsSecretName}\n`;
        yaml += `      hosts:\n`;
        yaml += `        - ${data.ingressHost || 'chart-example.local'}\n`;
    }
    yaml += `\n`;

    yaml += `resources:\n`;
    if (data.cpuRequest || data.memoryRequest || data.cpuLimit || data.memoryLimit) {
        yaml += `  requests:\n`;
        yaml += `    cpu: ${data.cpuRequest || '100m'}\n`;
        yaml += `    memory: ${data.memoryRequest || '128Mi'}\n`;
        yaml += `  limits:\n`;
        yaml += `    cpu: ${data.cpuLimit || '500m'}\n`;
        yaml += `    memory: ${data.memoryLimit || '256Mi'}\n`;
    } else {
        yaml += `  {}\n`;
    }
    yaml += `\n`;

    yaml += `autoscaling:\n`;
    yaml += `  enabled: ${getSelectedResources().includes('hpa')}\n`;
    yaml += `  minReplicas: ${data.hpaMinReplicas}\n`;
    yaml += `  maxReplicas: ${data.hpaMaxReplicas}\n`;
    yaml += `  targetCPUUtilizationPercentage: ${data.hpaTargetCPU}\n\n`;

    yaml += `nodeSelector: {}\n\n`;
    yaml += `tolerations: []\n\n`;
    yaml += `affinity: {}\n\n`;

    // Environment variables
    if (data.envVars.length > 0) {
        yaml += `env:\n`;
        data.envVars.forEach(env => {
            yaml += `  - name: ${env.name}\n`;
            yaml += `    value: "${env.value}"\n`;
        });
    } else {
        yaml += `env: []\n`;
    }
    yaml += `\n`;

    yaml += `# Probes\n`;
    yaml += `livenessProbe:\n`;
    if (data.livenessType === 'httpGet') {
        yaml += `  httpGet:\n`;
        yaml += `    path: ${data.livenessPath || '/healthz'}\n`;
        yaml += `    port: http\n`;
    } else {
        yaml += `  # Configure liveness probe\n`;
        yaml += `  {}\n`;
    }
    yaml += `readinessProbe:\n`;
    if (data.readinessType === 'httpGet') {
        yaml += `  httpGet:\n`;
        yaml += `    path: ${data.readinessPath || '/ready'}\n`;
        yaml += `    port: http\n`;
    } else {
        yaml += `  # Configure readiness probe\n`;
        yaml += `  {}\n`;
    }

    return yaml;
}

// ===== Helm Deployment Template =====

function generateHelmDeploymentTemplate(name) {
    let t = '';
    t += `apiVersion: apps/v1\n`;
    t += `kind: Deployment\n`;
    t += `metadata:\n`;
    t += `  name: {{ include "${name}.fullname" . }}\n`;
    t += `  labels:\n`;
    t += `    {{- include "${name}.labels" . | nindent 4 }}\n`;
    t += `spec:\n`;
    t += `  {{- if not .Values.autoscaling.enabled }}\n`;
    t += `  replicas: {{ .Values.replicaCount }}\n`;
    t += `  {{- end }}\n`;
    t += `  selector:\n`;
    t += `    matchLabels:\n`;
    t += `      {{- include "${name}.selectorLabels" . | nindent 6 }}\n`;
    t += `  template:\n`;
    t += `    metadata:\n`;
    t += `      labels:\n`;
    t += `        {{- include "${name}.selectorLabels" . | nindent 8 }}\n`;
    t += `    spec:\n`;
    t += `      serviceAccountName: {{ include "${name}.serviceAccountName" . }}\n`;
    t += `      containers:\n`;
    t += `        - name: {{ .Chart.Name }}\n`;
    t += `          image: "{{ .Values.image.repository }}:{{ .Values.image.tag | default .Chart.AppVersion }}"\n`;
    t += `          imagePullPolicy: {{ .Values.image.pullPolicy }}\n`;
    t += `          ports:\n`;
    t += `            - name: http\n`;
    t += `              containerPort: {{ .Values.service.port }}\n`;
    t += `              protocol: TCP\n`;
    t += `          {{- if .Values.env }}\n`;
    t += `          env:\n`;
    t += `            {{- toYaml .Values.env | nindent 12 }}\n`;
    t += `          {{- end }}\n`;
    t += `          livenessProbe:\n`;
    t += `            {{- toYaml .Values.livenessProbe | nindent 12 }}\n`;
    t += `          readinessProbe:\n`;
    t += `            {{- toYaml .Values.readinessProbe | nindent 12 }}\n`;
    t += `          resources:\n`;
    t += `            {{- toYaml .Values.resources | nindent 12 }}\n`;
    t += `      {{- with .Values.nodeSelector }}\n`;
    t += `      nodeSelector:\n`;
    t += `        {{- toYaml . | nindent 8 }}\n`;
    t += `      {{- end }}\n`;
    t += `      {{- with .Values.tolerations }}\n`;
    t += `      tolerations:\n`;
    t += `        {{- toYaml . | nindent 8 }}\n`;
    t += `      {{- end }}\n`;
    return t;
}

// ===== Helm Service Template =====

function generateHelmServiceTemplate() {
    let t = '';
    t += `apiVersion: v1\n`;
    t += `kind: Service\n`;
    t += `metadata:\n`;
    t += `  name: {{ include "CHART.fullname" . }}\n`;
    t += `  labels:\n`;
    t += `    {{- include "CHART.labels" . | nindent 4 }}\n`;
    t += `spec:\n`;
    t += `  type: {{ .Values.service.type }}\n`;
    t += `  ports:\n`;
    t += `    - port: {{ .Values.service.port }}\n`;
    t += `      targetPort: http\n`;
    t += `      protocol: TCP\n`;
    t += `      name: http\n`;
    t += `  selector:\n`;
    t += `    {{- include "CHART.selectorLabels" . | nindent 4 }}\n`;
    return t;
}
