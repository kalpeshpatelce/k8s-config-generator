/**
 * K8s Config Generator - Main Application Logic
 * Handles UI interactions, real-time preview, and state management.
 */

// ===== State Management =====
const STORAGE_KEY = 'k8s-config-generator-state';

// ===== Initialize Application =====
document.addEventListener('DOMContentLoaded', () => {
    loadState();
    setupEventListeners();
    updateOutput();
});

// ===== Event Listeners =====
function setupEventListeners() {
    // Form change listeners for real-time preview
    const form = document.getElementById('k8sForm');
    form.addEventListener('input', debounce(handleFormChange, 300));
    form.addEventListener('change', handleFormChange);

    // Resource type checkboxes - toggle conditional sections
    document.querySelectorAll('input[name="resourceType"]').forEach(cb => {
        cb.addEventListener('change', handleResourceToggle);
    });

    // Service type change - show/hide node port
    document.getElementById('serviceType').addEventListener('change', (e) => {
        const nodePortGroup = document.getElementById('nodePortGroup');
        nodePortGroup.style.display = e.target.value === 'NodePort' ? 'block' : 'none';
    });

    // Add environment variable row
    document.getElementById('addEnvBtn').addEventListener('click', addEnvRow);

    // Add volume mount row
    document.getElementById('addVolumeBtn').addEventListener('click', addVolumeRow);

    // Add init container row
    document.getElementById('addInitContainerBtn').addEventListener('click', addInitContainerRow);

    // Remove buttons (event delegation)
    document.getElementById('envVars').addEventListener('click', (e) => {
        if (e.target.classList.contains('btn-remove')) {
            const rows = document.querySelectorAll('.env-row');
            if (rows.length > 1) {
                e.target.closest('.env-row').remove();
                handleFormChange();
            }
        }
    });

    document.getElementById('volumeMounts').addEventListener('click', (e) => {
        if (e.target.classList.contains('btn-remove')) {
            const rows = document.querySelectorAll('.volume-row');
            if (rows.length > 1) {
                e.target.closest('.volume-row').remove();
                handleFormChange();
            }
        }
    });

    // Init containers remove
    document.getElementById('initContainers').addEventListener('click', (e) => {
        if (e.target.classList.contains('btn-remove')) {
            const rows = document.querySelectorAll('.init-container-row');
            if (rows.length > 1) {
                e.target.closest('.init-container-row').remove();
                handleFormChange();
            }
        }
    });

    // Strategy type change
    document.getElementById('strategyType').addEventListener('change', (e) => {
        document.getElementById('rollingUpdateConfig').style.display = e.target.value === 'RollingUpdate' ? 'flex' : 'none';
    });

    // Preset selector
    document.getElementById('presets').addEventListener('change', loadPreset);

    // Reset button
    document.getElementById('resetBtn').addEventListener('click', resetForm);

    // Download All button
    document.getElementById('downloadAllBtn').addEventListener('click', downloadAll);

    // Copy and download buttons (event delegation)
    document.getElementById('outputContent').addEventListener('click', (e) => {
        if (e.target.classList.contains('btn-copy')) {
            handleCopy(e.target);
        } else if (e.target.classList.contains('btn-download')) {
            handleDownload(e.target);
        }
    });

    // Tab clicks
    document.getElementById('outputTabs').addEventListener('click', (e) => {
        if (e.target.classList.contains('tab')) {
            switchTab(e.target.dataset.tab);
        }
    });
}

// ===== Form Handlers =====
function handleFormChange() {
    saveState();
    updateOutput();
}

function handleResourceToggle(e) {
    const value = e.target.value;

    // Toggle conditional sections
    const sectionMap = {
        service: 'serviceSection',
        ingress: 'ingressSection',
        cronjob: 'cronjobSection',
        hpa: 'hpaSection',
        pv: 'pvSection',
        storageclass: 'storageclassSection',
        role: 'rbacSection',
        rolebinding: 'rbacSection',
        clusterrole: 'rbacSection',
        clusterrolebinding: 'rbacSection',
        pdb: 'pdbSection',
        limitrange: 'limitrangeSection',
        resourcequota: 'resourcequotaSection',
        priorityclass: 'priorityclassSection',
        endpoints: 'endpointsSection',
    };

    if (sectionMap[value]) {
        const section = document.getElementById(sectionMap[value]);
        // For RBAC, check if any RBAC resource is still checked
        if (['role', 'rolebinding', 'clusterrole', 'clusterrolebinding'].includes(value)) {
            const rbacChecked = ['role', 'rolebinding', 'clusterrole', 'clusterrolebinding'].some(r =>
                document.querySelector(`input[name="resourceType"][value="${r}"]`).checked
            );
            section.style.display = rbacChecked ? 'block' : 'none';
        } else {
            section.style.display = e.target.checked ? 'block' : 'none';
        }
    }

    handleFormChange();
}

function addEnvRow() {
    const container = document.getElementById('envVars');
    const row = document.createElement('div');
    row.className = 'env-row';
    row.innerHTML = `
        <input type="text" placeholder="KEY" class="env-key">
        <input type="text" placeholder="value" class="env-value">
        <button type="button" class="btn btn-remove" aria-label="Remove environment variable">&#10005;</button>
    `;
    container.appendChild(row);
}

function addVolumeRow() {
    const container = document.getElementById('volumeMounts');
    const row = document.createElement('div');
    row.className = 'volume-row';
    row.innerHTML = `
        <input type="text" placeholder="Volume Name" class="vol-name">
        <input type="text" placeholder="/mount/path" class="vol-path">
        <select class="vol-type">
            <option value="">Type...</option>
            <option value="emptyDir">emptyDir</option>
            <option value="hostPath">hostPath</option>
            <option value="pvc">PVC</option>
            <option value="configMap">ConfigMap</option>
            <option value="secret">Secret</option>
        </select>
        <button type="button" class="btn btn-remove" aria-label="Remove volume mount">&#10005;</button>
    `;
    container.appendChild(row);
}

function addInitContainerRow() {
    const container = document.getElementById('initContainers');
    const row = document.createElement('div');
    row.className = 'init-container-row';
    row.innerHTML = `
        <input type="text" placeholder="Init Container Name" class="init-name">
        <input type="text" placeholder="Image (e.g., busybox:1.36)" class="init-image">
        <input type="text" placeholder="Command (e.g., sh,-c,sleep 5)" class="init-command">
        <button type="button" class="btn btn-remove" aria-label="Remove init container">&#10005;</button>
    `;
    container.appendChild(row);
}

// ===== Output Generation =====
function updateOutput() {
    const result = generateAllYAML();
    const resources = getSelectedResources();

    // Update tabs
    updateTabs(resources);

    // Update combined YAML
    const combinedEl = document.querySelector('#tab-combined .yaml-output code');
    if (combinedEl) {
        combinedEl.innerHTML = highlightYAML(result.combined || '# Select resource types and fill in required fields');
    }

    // Update individual tabs
    Object.entries(result.individual).forEach(([resource, yaml]) => {
        const el = document.querySelector(`#tab-${resource} .yaml-output code`);
        if (el) {
            el.innerHTML = highlightYAML(yaml);
        }
    });

    // Update kubectl commands tab
    const cmdEl = document.querySelector('#tab-kubectl .yaml-output');
    if (cmdEl) {
        cmdEl.innerHTML = generateKubectlCommands();
    }
}

function updateTabs(resources) {
    const tabsContainer = document.getElementById('outputTabs');
    const contentContainer = document.getElementById('outputContent');
    const activeTab = tabsContainer.querySelector('.tab.active');
    const activeTabId = activeTab ? activeTab.dataset.tab : 'combined';

    // Build tabs HTML
    let tabsHTML = `<button class="tab${activeTabId === 'combined' ? ' active' : ''}" data-tab="combined" role="tab">Combined YAML</button>`;

    resources.forEach(r => {
        const label = getResourceLabel(r);
        tabsHTML += `<button class="tab${activeTabId === r ? ' active' : ''}" data-tab="${r}" role="tab">${label}</button>`;
    });

    tabsHTML += `<button class="tab${activeTabId === 'kubectl' ? ' active' : ''}" data-tab="kubectl" role="tab">kubectl Commands</button>`;
    tabsContainer.innerHTML = tabsHTML;

    // Build content HTML
    let contentHTML = `
        <div class="tab-content${activeTabId === 'combined' ? ' active' : ''}" id="tab-combined">
            <div class="output-toolbar">
                <button class="btn btn-copy" data-target="combined">Copy</button>
                <button class="btn btn-download" data-target="combined">Download</button>
            </div>
            <pre class="yaml-output"><code></code></pre>
        </div>`;

    resources.forEach(r => {
        contentHTML += `
        <div class="tab-content${activeTabId === r ? ' active' : ''}" id="tab-${r}">
            <div class="output-toolbar">
                <button class="btn btn-copy" data-target="${r}">Copy</button>
                <button class="btn btn-download" data-target="${r}">Download</button>
            </div>
            <pre class="yaml-output"><code></code></pre>
        </div>`;
    });

    contentHTML += `
        <div class="tab-content${activeTabId === 'kubectl' ? ' active' : ''}" id="tab-kubectl">
            <div class="output-toolbar">
                <button class="btn btn-copy" data-target="kubectl">Copy</button>
            </div>
            <pre class="yaml-output" style="white-space:normal;font-family:inherit;"></pre>
        </div>`;

    contentContainer.innerHTML = contentHTML;
}

function getResourceLabel(resource) {
    const labels = {
        namespace: 'Namespace', pod: 'Pod', deployment: 'Deployment', service: 'Service',
        replicaset: 'ReplicaSet', statefulset: 'StatefulSet',
        daemonset: 'DaemonSet', job: 'Job', cronjob: 'CronJob',
        ingress: 'Ingress', configmap: 'ConfigMap', secret: 'Secret',
        pvc: 'PVC', pv: 'PV', storageclass: 'StorageClass',
        hpa: 'HPA', networkpolicy: 'NetworkPolicy',
        serviceaccount: 'ServiceAccount', role: 'Role', rolebinding: 'RoleBinding',
        clusterrole: 'ClusterRole', clusterrolebinding: 'ClusterRoleBinding',
        limitrange: 'LimitRange', resourcequota: 'ResourceQuota',
        pdb: 'PDB', priorityclass: 'PriorityClass', endpoints: 'Endpoints'
    };
    return labels[resource] || resource;
}

// ===== Tab Switching =====
function switchTab(tabId) {
    // Update tab buttons
    document.querySelectorAll('.tab').forEach(t => {
        t.classList.toggle('active', t.dataset.tab === tabId);
        t.setAttribute('aria-selected', t.dataset.tab === tabId);
    });

    // Update tab content
    document.querySelectorAll('.tab-content').forEach(c => {
        c.classList.toggle('active', c.id === `tab-${tabId}`);
    });
}

// ===== YAML Syntax Highlighting =====
function highlightYAML(yaml) {
    if (!yaml) return '';

    return yaml.split('\n').map(line => {
        // Comments
        if (line.trim().startsWith('#')) {
            return `<span class="yaml-comment">${escapeHtml(line)}</span>`;
        }

        // Document separator
        if (line.trim() === '---') {
            return `<span class="yaml-separator">${escapeHtml(line)}</span>`;
        }

        // Key-value pairs
        const kvMatch = line.match(/^(\s*)([\w\-./]+)(:)\s*(.*)?$/);
        if (kvMatch) {
            const [, indent, key, colon, value] = kvMatch;
            let highlighted = `${escapeHtml(indent)}<span class="yaml-key">${escapeHtml(key)}</span>${escapeHtml(colon)}`;

            if (value !== undefined && value !== '') {
                highlighted += ' ' + highlightValue(value);
            }
            return highlighted;
        }

        // List items
        const listMatch = line.match(/^(\s*)(- )(.*)?$/);
        if (listMatch) {
            const [, indent, dash, value] = listMatch;
            let highlighted = `${escapeHtml(indent)}${escapeHtml(dash)}`;
            if (value) {
                // Check if list item has a key
                const itemKV = value.match(/^([\w\-./]+)(:)\s*(.*)?$/);
                if (itemKV) {
                    const [, k, c, v] = itemKV;
                    highlighted += `<span class="yaml-key">${escapeHtml(k)}</span>${escapeHtml(c)}`;
                    if (v !== undefined && v !== '') {
                        highlighted += ' ' + highlightValue(v);
                    }
                } else {
                    highlighted += highlightValue(value);
                }
            }
            return highlighted;
        }

        return escapeHtml(line);
    }).join('\n');
}

function highlightValue(value) {
    const trimmed = value.trim();

    // Null
    if (trimmed === 'null' || trimmed === '~') {
        return `<span class="yaml-null">${escapeHtml(value)}</span>`;
    }

    // Boolean
    if (/^(true|false|yes|no)$/i.test(trimmed)) {
        return `<span class="yaml-boolean">${escapeHtml(value)}</span>`;
    }

    // Number
    if (/^-?\d+(\.\d+)?$/.test(trimmed)) {
        return `<span class="yaml-number">${escapeHtml(value)}</span>`;
    }

    // Quoted string
    if ((trimmed.startsWith('"') && trimmed.endsWith('"')) ||
        (trimmed.startsWith("'") && trimmed.endsWith("'"))) {
        return `<span class="yaml-string">${escapeHtml(value)}</span>`;
    }

    // Empty object/array
    if (trimmed === '{}' || trimmed === '[]') {
        return `<span class="yaml-value">${escapeHtml(value)}</span>`;
    }

    // Default string value
    return `<span class="yaml-value">${escapeHtml(value)}</span>`;
}

function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
}

// ===== Copy & Download =====
function handleCopy(btn) {
    const target = btn.dataset.target;
    let text = '';

    if (target === 'kubectl') {
        // Get all kubectl commands as plain text
        const cmds = document.querySelectorAll('#tab-kubectl .kubectl-cmd');
        text = Array.from(cmds).map(c => c.textContent).join('\n');
    } else if (target === 'combined') {
        const result = generateAllYAML();
        text = result.combined;
    } else {
        const result = generateAllYAML();
        text = result.individual[target] || '';
    }

    navigator.clipboard.writeText(text).then(() => {
        btn.classList.add('copied');
        btn.textContent = 'Copied!';
        setTimeout(() => {
            btn.classList.remove('copied');
            btn.textContent = 'Copy';
        }, 2000);
    });
}

function handleDownload(btn) {
    const target = btn.dataset.target;
    const data = getFormData();
    let text = '';
    let filename = '';

    if (target === 'combined') {
        const result = generateAllYAML();
        text = result.combined;
        filename = `${data.name || 'k8s-config'}.yaml`;
    } else {
        const result = generateAllYAML();
        text = result.individual[target] || '';
        filename = `${data.name || 'k8s'}-${target}.yaml`;
    }

    downloadFile(text, filename);
}

function downloadAll() {
    const data = getFormData();
    const result = generateAllYAML();
    const filename = `${data.name || 'k8s-config'}.yaml`;
    downloadFile(result.combined, filename);
}

function downloadFile(content, filename) {
    const blob = new Blob([content], { type: 'text/yaml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast(`Downloaded ${filename}`);
}

// ===== Toast Notification =====
function showToast(message) {
    const existing = document.querySelector('.toast');
    if (existing) existing.remove();

    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    document.body.appendChild(toast);

    setTimeout(() => toast.remove(), 3000);
}

// ===== LocalStorage State =====
function saveState() {
    const state = {
        dockerImage: document.getElementById('dockerImage').value,
        appName: document.getElementById('appName').value,
        namespace: document.getElementById('namespace').value,
        replicas: document.getElementById('replicas').value,
        containerPort: document.getElementById('containerPort').value,
        labels: document.getElementById('labels').value,
        serviceType: document.getElementById('serviceType').value,
        targetPort: document.getElementById('targetPort').value,
        nodePort: document.getElementById('nodePort').value,
        protocol: document.getElementById('protocol').value,
        ingressHost: document.getElementById('ingressHost').value,
        ingressPath: document.getElementById('ingressPath').value,
        pathType: document.getElementById('pathType').value,
        tlsSecretName: document.getElementById('tlsSecretName').value,
        ingressClass: document.getElementById('ingressClass').value,
        cpuRequest: document.getElementById('cpuRequest').value,
        cpuLimit: document.getElementById('cpuLimit').value,
        memoryRequest: document.getElementById('memoryRequest').value,
        memoryLimit: document.getElementById('memoryLimit').value,
        livenessType: document.getElementById('livenessType').value,
        livenessPath: document.getElementById('livenessPath').value,
        livenessPort: document.getElementById('livenessPort').value,
        livenessInitialDelay: document.getElementById('livenessInitialDelay').value,
        livenessPeriod: document.getElementById('livenessPeriod').value,
        readinessType: document.getElementById('readinessType').value,
        readinessPath: document.getElementById('readinessPath').value,
        readinessPort: document.getElementById('readinessPort').value,
        readinessInitialDelay: document.getElementById('readinessInitialDelay').value,
        readinessPeriod: document.getElementById('readinessPeriod').value,
        cronSchedule: document.getElementById('cronSchedule').value,
        cronRestartPolicy: document.getElementById('cronRestartPolicy').value,
        hpaMinReplicas: document.getElementById('hpaMinReplicas').value,
        hpaMaxReplicas: document.getElementById('hpaMaxReplicas').value,
        hpaTargetCPU: document.getElementById('hpaTargetCPU').value,
        imagePullPolicy: document.getElementById('imagePullPolicy').value,
        restartPolicy: document.getElementById('restartPolicy').value,
        serviceAccountName: document.getElementById('serviceAccountName').value,
        nodeSelector: document.getElementById('nodeSelector').value,
        tolerations: document.getElementById('tolerations').value,
        annotations: document.getElementById('annotations').value,
        selectedResources: getSelectedResources(),
    };

    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
        // localStorage might be full or unavailable
    }
}

function loadState() {
    try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (!saved) return;

        const state = JSON.parse(saved);

        // Restore simple inputs
        const fields = [
            'dockerImage', 'appName', 'namespace', 'replicas', 'containerPort',
            'labels', 'serviceType', 'targetPort', 'nodePort', 'protocol',
            'ingressHost', 'ingressPath', 'pathType', 'tlsSecretName', 'ingressClass',
            'cpuRequest', 'cpuLimit', 'memoryRequest', 'memoryLimit',
            'livenessType', 'livenessPath', 'livenessPort', 'livenessInitialDelay', 'livenessPeriod',
            'readinessType', 'readinessPath', 'readinessPort', 'readinessInitialDelay', 'readinessPeriod',
            'cronSchedule', 'cronRestartPolicy',
            'hpaMinReplicas', 'hpaMaxReplicas', 'hpaTargetCPU',
            'imagePullPolicy', 'restartPolicy', 'serviceAccountName',
            'nodeSelector', 'tolerations', 'annotations'
        ];

        fields.forEach(field => {
            const el = document.getElementById(field);
            if (el && state[field] !== undefined) {
                el.value = state[field];
            }
        });

        // Restore checkboxes
        if (state.selectedResources) {
            document.querySelectorAll('input[name="resourceType"]').forEach(cb => {
                cb.checked = state.selectedResources.includes(cb.value);
            });

            // Show conditional sections
            const sectionMap = {
                service: 'serviceSection',
                ingress: 'ingressSection',
                cronjob: 'cronjobSection',
                hpa: 'hpaSection',
                pv: 'pvSection',
                storageclass: 'storageclassSection',
                pdb: 'pdbSection',
                limitrange: 'limitrangeSection',
                resourcequota: 'resourcequotaSection',
                priorityclass: 'priorityclassSection',
                endpoints: 'endpointsSection',
            };
            Object.entries(sectionMap).forEach(([resource, sectionId]) => {
                const section = document.getElementById(sectionId);
                if (section) {
                    section.style.display = state.selectedResources.includes(resource) ? 'block' : 'none';
                }
            });
            // RBAC section
            const rbacSection = document.getElementById('rbacSection');
            if (rbacSection) {
                const rbacChecked = ['role', 'rolebinding', 'clusterrole', 'clusterrolebinding'].some(r =>
                    state.selectedResources.includes(r)
                );
                rbacSection.style.display = rbacChecked ? 'block' : 'none';
            }
        }

        // Restore node port visibility
        if (state.serviceType === 'NodePort') {
            document.getElementById('nodePortGroup').style.display = 'block';
        }
    } catch (e) {
        // If state is corrupted, ignore
    }
}

// ===== Reset Form =====
function resetForm() {
    document.getElementById('k8sForm').reset();

    // Reset checkboxes to default (only deployment checked)
    document.querySelectorAll('input[name="resourceType"]').forEach(cb => {
        cb.checked = cb.value === 'deployment';
    });

    // Hide conditional sections
    document.getElementById('serviceSection').style.display = 'none';
    document.getElementById('ingressSection').style.display = 'none';
    document.getElementById('cronjobSection').style.display = 'none';
    document.getElementById('hpaSection').style.display = 'none';
    document.getElementById('nodePortGroup').style.display = 'none';
    document.getElementById('pvSection').style.display = 'none';
    document.getElementById('storageclassSection').style.display = 'none';
    document.getElementById('rbacSection').style.display = 'none';
    document.getElementById('pdbSection').style.display = 'none';
    document.getElementById('limitrangeSection').style.display = 'none';
    document.getElementById('resourcequotaSection').style.display = 'none';
    document.getElementById('priorityclassSection').style.display = 'none';
    document.getElementById('endpointsSection').style.display = 'none';

    // Reset env vars and volumes to single empty row
    document.getElementById('envVars').innerHTML = `
        <div class="env-row">
            <input type="text" placeholder="KEY" class="env-key">
            <input type="text" placeholder="value" class="env-value">
            <button type="button" class="btn btn-remove" aria-label="Remove environment variable">&#10005;</button>
        </div>`;

    document.getElementById('volumeMounts').innerHTML = `
        <div class="volume-row">
            <input type="text" placeholder="Volume Name" class="vol-name">
            <input type="text" placeholder="/mount/path" class="vol-path">
            <select class="vol-type">
                <option value="">Type...</option>
                <option value="emptyDir">emptyDir</option>
                <option value="hostPath">hostPath</option>
                <option value="pvc">PVC</option>
                <option value="configMap">ConfigMap</option>
                <option value="secret">Secret</option>
            </select>
            <button type="button" class="btn btn-remove" aria-label="Remove volume mount">&#10005;</button>
        </div>`;

    document.getElementById('initContainers').innerHTML = `
        <div class="init-container-row">
            <input type="text" placeholder="Init Container Name" class="init-name">
            <input type="text" placeholder="Image (e.g., busybox:1.36)" class="init-image">
            <input type="text" placeholder="Command (e.g., sh,-c,sleep 5)" class="init-command">
            <button type="button" class="btn btn-remove" aria-label="Remove init container">&#10005;</button>
        </div>`;

    // Reset preset selector
    document.getElementById('presets').value = '';

    // Clear storage and update
    localStorage.removeItem(STORAGE_KEY);
    updateOutput();
    showToast('Form reset');
}

// ===== Presets =====
function loadPreset(e) {
    const preset = e.target.value;
    if (!preset) return;

    // Reset first
    document.getElementById('k8sForm').reset();
    document.querySelectorAll('input[name="resourceType"]').forEach(cb => cb.checked = false);

    const presets = {
        'simple-web': {
            dockerImage: 'nginx:1.25-alpine',
            appName: 'web-app',
            namespace: 'default',
            replicas: 3,
            containerPort: 80,
            labels: 'env=production,tier=frontend',
            resources: ['deployment', 'service'],
            serviceType: 'ClusterIP',
            cpuRequest: '100m',
            cpuLimit: '500m',
            memoryRequest: '128Mi',
            memoryLimit: '256Mi',
            livenessType: 'httpGet',
            livenessPath: '/healthz',
            readinessType: 'httpGet',
            readinessPath: '/ready',
            imagePullPolicy: 'IfNotPresent',
        },
        'redis-cache': {
            dockerImage: 'redis:7-alpine',
            appName: 'redis-cache',
            namespace: 'default',
            replicas: 1,
            containerPort: 6379,
            labels: 'tier=cache',
            resources: ['deployment', 'service'],
            serviceType: 'ClusterIP',
            cpuRequest: '100m',
            cpuLimit: '250m',
            memoryRequest: '256Mi',
            memoryLimit: '512Mi',
            livenessType: 'tcpSocket',
            readinessType: 'tcpSocket',
            imagePullPolicy: 'IfNotPresent',
        },
        'postgres-statefulset': {
            dockerImage: 'postgres:16-alpine',
            appName: 'postgres',
            namespace: 'database',
            replicas: 1,
            containerPort: 5432,
            labels: 'tier=database',
            resources: ['statefulset', 'service', 'pvc', 'secret'],
            serviceType: 'ClusterIP',
            cpuRequest: '250m',
            cpuLimit: '1000m',
            memoryRequest: '512Mi',
            memoryLimit: '1Gi',
            livenessType: 'tcpSocket',
            readinessType: 'exec',
            imagePullPolicy: 'IfNotPresent',
            envVars: [
                { key: 'POSTGRES_DB', value: 'mydb' },
                { key: 'POSTGRES_USER', value: 'admin' },
            ],
        },
        'nginx-ingress': {
            dockerImage: 'nginx:1.25-alpine',
            appName: 'web-frontend',
            namespace: 'default',
            replicas: 2,
            containerPort: 80,
            labels: 'tier=frontend',
            resources: ['deployment', 'service', 'ingress'],
            serviceType: 'ClusterIP',
            ingressHost: 'app.example.com',
            ingressPath: '/',
            pathType: 'Prefix',
            ingressClass: 'nginx',
            cpuRequest: '100m',
            cpuLimit: '500m',
            memoryRequest: '128Mi',
            memoryLimit: '256Mi',
            imagePullPolicy: 'IfNotPresent',
        },
        'cronjob-backup': {
            dockerImage: 'alpine:3.18',
            appName: 'backup-job',
            namespace: 'default',
            replicas: 1,
            containerPort: '',
            labels: 'type=backup',
            resources: ['cronjob'],
            cronSchedule: '0 2 * * *',
            cronRestartPolicy: 'OnFailure',
            cpuRequest: '100m',
            cpuLimit: '500m',
            memoryRequest: '128Mi',
            memoryLimit: '512Mi',
            imagePullPolicy: 'Always',
            restartPolicy: 'OnFailure',
        },
    };

    const config = presets[preset];
    if (!config) return;

    applyPreset(config);
    handleFormChange();
    showToast(`Loaded preset: ${e.target.options[e.target.selectedIndex].text}`);
}

function applyPreset(config) {
    // Set simple fields
    const fieldMap = {
        dockerImage: 'dockerImage',
        appName: 'appName',
        namespace: 'namespace',
        replicas: 'replicas',
        containerPort: 'containerPort',
        labels: 'labels',
        serviceType: 'serviceType',
        ingressHost: 'ingressHost',
        ingressPath: 'ingressPath',
        pathType: 'pathType',
        ingressClass: 'ingressClass',
        cpuRequest: 'cpuRequest',
        cpuLimit: 'cpuLimit',
        memoryRequest: 'memoryRequest',
        memoryLimit: 'memoryLimit',
        livenessType: 'livenessType',
        livenessPath: 'livenessPath',
        readinessType: 'readinessType',
        readinessPath: 'readinessPath',
        cronSchedule: 'cronSchedule',
        cronRestartPolicy: 'cronRestartPolicy',
        imagePullPolicy: 'imagePullPolicy',
        restartPolicy: 'restartPolicy',
    };

    Object.entries(fieldMap).forEach(([configKey, fieldId]) => {
        if (config[configKey] !== undefined) {
            const el = document.getElementById(fieldId);
            if (el) el.value = config[configKey];
        }
    });

    // Set resource checkboxes
    if (config.resources) {
        document.querySelectorAll('input[name="resourceType"]').forEach(cb => {
            cb.checked = config.resources.includes(cb.value);
        });

        // Show/hide conditional sections
        const sectionMap = {
            service: 'serviceSection',
            ingress: 'ingressSection',
            cronjob: 'cronjobSection',
            hpa: 'hpaSection',
        };
        Object.entries(sectionMap).forEach(([resource, sectionId]) => {
            const section = document.getElementById(sectionId);
            if (section) {
                section.style.display = config.resources.includes(resource) ? 'block' : 'none';
            }
        });
    }

    // Set environment variables
    if (config.envVars && config.envVars.length > 0) {
        const container = document.getElementById('envVars');
        container.innerHTML = '';
        config.envVars.forEach(env => {
            const row = document.createElement('div');
            row.className = 'env-row';
            row.innerHTML = `
                <input type="text" placeholder="KEY" class="env-key" value="${env.key}">
                <input type="text" placeholder="value" class="env-value" value="${env.value}">
                <button type="button" class="btn btn-remove" aria-label="Remove environment variable">&#10005;</button>
            `;
            container.appendChild(row);
        });
    }
}

// ===== Utility Functions =====
function debounce(fn, delay) {
    let timer;
    return function(...args) {
        clearTimeout(timer);
        timer = setTimeout(() => fn.apply(this, args), delay);
    };
}

// ===== Form Validation =====
function validateForm() {
    let valid = true;
    const image = document.getElementById('dockerImage');
    const name = document.getElementById('appName');

    if (!image.value.trim()) {
        image.classList.add('invalid');
        valid = false;
    } else {
        image.classList.remove('invalid');
    }

    if (!name.value.trim()) {
        name.classList.add('invalid');
        valid = false;
    } else {
        name.classList.remove('invalid');
    }

    return valid;
}

// Validate on blur
document.addEventListener('DOMContentLoaded', () => {
    ['dockerImage', 'appName'].forEach(id => {
        document.getElementById(id).addEventListener('blur', function() {
            if (!this.value.trim()) {
                this.classList.add('invalid');
            } else {
                this.classList.remove('invalid');
            }
        });
    });
});
