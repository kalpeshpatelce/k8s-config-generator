/**
 * K8s Config Generator - YAML Generation Functions
 * Generates valid, production-ready Kubernetes YAML configurations.
 */

// ===== Helper Functions =====

function getFormData() {
    const data = {
        image: document.getElementById('dockerImage').value.trim(),
        name: document.getElementById('appName').value.trim(),
        namespace: document.getElementById('namespace').value.trim() || 'default',
        replicas: parseInt(document.getElementById('replicas').value) || 1,
        containerPort: parseInt(document.getElementById('containerPort').value) || null,
        labels: parseKeyValue(document.getElementById('labels').value),
        // Service
        serviceType: document.getElementById('serviceType').value,
        targetPort: parseInt(document.getElementById('targetPort').value) || null,
        nodePort: parseInt(document.getElementById('nodePort').value) || null,
        protocol: document.getElementById('protocol').value,
        // Ingress
        ingressHost: document.getElementById('ingressHost').value.trim(),
        ingressPath: document.getElementById('ingressPath').value.trim() || '/',
        pathType: document.getElementById('pathType').value,
        tlsSecretName: document.getElementById('tlsSecretName').value.trim(),
        ingressClass: document.getElementById('ingressClass').value,
        // Resources
        cpuRequest: document.getElementById('cpuRequest').value.trim(),
        cpuLimit: document.getElementById('cpuLimit').value.trim(),
        memoryRequest: document.getElementById('memoryRequest').value.trim(),
        memoryLimit: document.getElementById('memoryLimit').value.trim(),
        // Probes
        livenessType: document.getElementById('livenessType').value,
        livenessPath: document.getElementById('livenessPath').value.trim(),
        livenessPort: parseInt(document.getElementById('livenessPort').value) || null,
        livenessInitialDelay: parseInt(document.getElementById('livenessInitialDelay').value) || 30,
        livenessPeriod: parseInt(document.getElementById('livenessPeriod').value) || 10,
        readinessType: document.getElementById('readinessType').value,
        readinessPath: document.getElementById('readinessPath').value.trim(),
        readinessPort: parseInt(document.getElementById('readinessPort').value) || null,
        readinessInitialDelay: parseInt(document.getElementById('readinessInitialDelay').value) || 5,
        readinessPeriod: parseInt(document.getElementById('readinessPeriod').value) || 10,
        // CronJob
        cronSchedule: document.getElementById('cronSchedule').value.trim() || '*/5 * * * *',
        cronRestartPolicy: document.getElementById('cronRestartPolicy').value,
        // HPA
        hpaMinReplicas: parseInt(document.getElementById('hpaMinReplicas').value) || 1,
        hpaMaxReplicas: parseInt(document.getElementById('hpaMaxReplicas').value) || 10,
        hpaTargetCPU: parseInt(document.getElementById('hpaTargetCPU').value) || 80,
        // Advanced
        imagePullPolicy: document.getElementById('imagePullPolicy').value,
        restartPolicy: document.getElementById('restartPolicy').value,
        serviceAccountName: document.getElementById('serviceAccountName').value.trim(),
        nodeSelector: parseKeyValue(document.getElementById('nodeSelector').value),
        tolerations: document.getElementById('tolerations').value.trim(),
        annotations: parseKeyValue(document.getElementById('annotations').value),
        // Dynamic
        envVars: getEnvVars(),
        volumes: getVolumes(),
    };

    // Use containerPort as default targetPort if not specified
    if (!data.targetPort && data.containerPort) {
        data.targetPort = data.containerPort;
    }

    return data;
}

function parseKeyValue(str) {
    if (!str) return {};
    const result = {};
    str.split(',').forEach(pair => {
        const [key, value] = pair.split('=').map(s => s.trim());
        if (key && value !== undefined) {
            result[key] = value;
        }
    });
    return result;
}

function getEnvVars() {
    const rows = document.querySelectorAll('.env-row');
    const vars = [];
    rows.forEach(row => {
        const key = row.querySelector('.env-key').value.trim();
        const value = row.querySelector('.env-value').value.trim();
        if (key) {
            vars.push({ name: key, value: value });
        }
    });
    return vars;
}

function getVolumes() {
    const rows = document.querySelectorAll('.volume-row');
    const vols = [];
    rows.forEach(row => {
        const name = row.querySelector('.vol-name').value.trim();
        const path = row.querySelector('.vol-path').value.trim();
        const type = row.querySelector('.vol-type').value;
        if (name && path && type) {
            vols.push({ name, mountPath: path, type });
        }
    });
    return vols;
}

function getSelectedResources() {
    const checkboxes = document.querySelectorAll('input[name="resourceType"]:checked');
    return Array.from(checkboxes).map(cb => cb.value);
}

function indent(text, spaces) {
    const pad = ' '.repeat(spaces);
    return text.split('\n').map(line => line ? pad + line : line).join('\n');
}

// ===== Metadata Block =====

function generateMetadata(data, kind) {
    let yaml = `metadata:\n`;
    yaml += `  name: ${data.name}\n`;
    yaml += `  namespace: ${data.namespace}\n`;

    const allLabels = { app: data.name, ...data.labels };
    yaml += `  labels:\n`;
    Object.entries(allLabels).forEach(([key, value]) => {
        yaml += `    ${key}: "${value}"\n`;
    });

    if (Object.keys(data.annotations).length > 0) {
        yaml += `  annotations:\n`;
        Object.entries(data.annotations).forEach(([key, value]) => {
            yaml += `    ${key}: "${value}"\n`;
        });
    }

    return yaml;
}

// ===== Container Spec Block =====

function generateContainerSpec(data, indentLevel) {
    const pad = ' '.repeat(indentLevel);
    let yaml = '';

    yaml += `${pad}containers:\n`;
    yaml += `${pad}  - name: ${data.name}\n`;
    yaml += `${pad}    image: ${data.image}\n`;
    yaml += `${pad}    imagePullPolicy: ${data.imagePullPolicy}\n`;

    if (data.containerPort) {
        yaml += `${pad}    ports:\n`;
        yaml += `${pad}      - containerPort: ${data.containerPort}\n`;
        yaml += `${pad}        protocol: ${data.protocol || 'TCP'}\n`;
    }

    // Environment variables
    if (data.envVars.length > 0) {
        yaml += `${pad}    env:\n`;
        data.envVars.forEach(env => {
            yaml += `${pad}      - name: ${env.name}\n`;
            yaml += `${pad}        value: "${env.value}"\n`;
        });
    }

    // Resource limits
    if (data.cpuRequest || data.cpuLimit || data.memoryRequest || data.memoryLimit) {
        yaml += `${pad}    resources:\n`;
        if (data.cpuRequest || data.memoryRequest) {
            yaml += `${pad}      requests:\n`;
            if (data.cpuRequest) yaml += `${pad}        cpu: "${data.cpuRequest}"\n`;
            if (data.memoryRequest) yaml += `${pad}        memory: "${data.memoryRequest}"\n`;
        }
        if (data.cpuLimit || data.memoryLimit) {
            yaml += `${pad}      limits:\n`;
            if (data.cpuLimit) yaml += `${pad}        cpu: "${data.cpuLimit}"\n`;
            if (data.memoryLimit) yaml += `${pad}        memory: "${data.memoryLimit}"\n`;
        }
    }

    // Volume mounts
    if (data.volumes.length > 0) {
        yaml += `${pad}    volumeMounts:\n`;
        data.volumes.forEach(vol => {
            yaml += `${pad}      - name: ${vol.name}\n`;
            yaml += `${pad}        mountPath: ${vol.mountPath}\n`;
        });
    }

    // Liveness probe
    if (data.livenessType) {
        yaml += generateProbe(data, 'liveness', indentLevel + 4);
    }

    // Readiness probe
    if (data.readinessType) {
        yaml += generateProbe(data, 'readiness', indentLevel + 4);
    }

    return yaml;
}

function generateProbe(data, type, indentLevel) {
    const pad = ' '.repeat(indentLevel);
    const probeType = data[`${type}Type`];
    const path = data[`${type}Path`];
    const port = data[`${type}Port`] || data.containerPort || 80;
    const initialDelay = data[`${type}InitialDelay`];
    const period = data[`${type}Period`];

    let yaml = `${pad}${type}Probe:\n`;

    if (probeType === 'httpGet') {
        yaml += `${pad}  httpGet:\n`;
        yaml += `${pad}    path: ${path || '/healthz'}\n`;
        yaml += `${pad}    port: ${port}\n`;
    } else if (probeType === 'tcpSocket') {
        yaml += `${pad}  tcpSocket:\n`;
        yaml += `${pad}    port: ${port}\n`;
    } else if (probeType === 'exec') {
        yaml += `${pad}  exec:\n`;
        yaml += `${pad}    command:\n`;
        yaml += `${pad}      - /bin/sh\n`;
        yaml += `${pad}      - -c\n`;
        yaml += `${pad}      - "echo healthy"\n`;
    }

    yaml += `${pad}  initialDelaySeconds: ${initialDelay}\n`;
    yaml += `${pad}  periodSeconds: ${period}\n`;

    return yaml;
}

// ===== Volume Spec Block =====

function generateVolumeSpec(data, indentLevel) {
    if (data.volumes.length === 0) return '';

    const pad = ' '.repeat(indentLevel);
    let yaml = `${pad}volumes:\n`;

    data.volumes.forEach(vol => {
        yaml += `${pad}  - name: ${vol.name}\n`;
        switch (vol.type) {
            case 'emptyDir':
                yaml += `${pad}    emptyDir: {}\n`;
                break;
            case 'hostPath':
                yaml += `${pad}    hostPath:\n`;
                yaml += `${pad}      path: ${vol.mountPath}\n`;
                yaml += `${pad}      type: DirectoryOrCreate\n`;
                break;
            case 'pvc':
                yaml += `${pad}    persistentVolumeClaim:\n`;
                yaml += `${pad}      claimName: ${vol.name}-pvc\n`;
                break;
            case 'configMap':
                yaml += `${pad}    configMap:\n`;
                yaml += `${pad}      name: ${vol.name}\n`;
                break;
            case 'secret':
                yaml += `${pad}    secret:\n`;
                yaml += `${pad}      secretName: ${vol.name}\n`;
                break;
        }
    });

    return yaml;
}

// ===== Pod Spec (shared) =====

function generatePodSpec(data, indentLevel) {
    const pad = ' '.repeat(indentLevel);
    let yaml = '';

    if (data.serviceAccountName) {
        yaml += `${pad}serviceAccountName: ${data.serviceAccountName}\n`;
    }

    // Node selector
    if (Object.keys(data.nodeSelector).length > 0) {
        yaml += `${pad}nodeSelector:\n`;
        Object.entries(data.nodeSelector).forEach(([key, value]) => {
            yaml += `${pad}  ${key}: "${value}"\n`;
        });
    }

    // Tolerations
    if (data.tolerations) {
        const parts = data.tolerations.split(':');
        const keyVal = parts[0] || '';
        const effect = parts[1] || 'NoSchedule';
        const [tolKey, tolValue] = keyVal.split('=');
        yaml += `${pad}tolerations:\n`;
        yaml += `${pad}  - key: "${tolKey}"\n`;
        if (tolValue) {
            yaml += `${pad}    operator: "Equal"\n`;
            yaml += `${pad}    value: "${tolValue}"\n`;
        } else {
            yaml += `${pad}    operator: "Exists"\n`;
        }
        yaml += `${pad}    effect: "${effect}"\n`;
    }

    yaml += generateContainerSpec(data, indentLevel);
    yaml += generateVolumeSpec(data, indentLevel);

    return yaml;
}

// ===== Resource Generators =====

function generatePod(data) {
    let yaml = `# Pod: ${data.name}\n`;
    yaml += `apiVersion: v1\n`;
    yaml += `kind: Pod\n`;
    yaml += generateMetadata(data);
    yaml += `spec:\n`;
    yaml += `  restartPolicy: ${data.restartPolicy}\n`;
    yaml += generatePodSpec(data, 2);
    return yaml;
}

function generateDeployment(data) {
    let yaml = `# Deployment: ${data.name}\n`;
    yaml += `apiVersion: apps/v1\n`;
    yaml += `kind: Deployment\n`;
    yaml += generateMetadata(data);
    yaml += `spec:\n`;
    yaml += `  replicas: ${data.replicas}\n`;
    yaml += `  selector:\n`;
    yaml += `    matchLabels:\n`;
    yaml += `      app: ${data.name}\n`;
    yaml += `  template:\n`;
    yaml += `    metadata:\n`;
    yaml += `      labels:\n`;
    yaml += `        app: ${data.name}\n`;
    Object.entries(data.labels).forEach(([key, value]) => {
        yaml += `        ${key}: "${value}"\n`;
    });
    yaml += `    spec:\n`;
    yaml += generatePodSpec(data, 6);
    return yaml;
}

function generateService(data) {
    const port = data.containerPort || 80;
    const targetPort = data.targetPort || port;

    let yaml = `# Service: ${data.name}\n`;
    yaml += `apiVersion: v1\n`;
    yaml += `kind: Service\n`;
    yaml += generateMetadata(data);
    yaml += `spec:\n`;
    yaml += `  type: ${data.serviceType}\n`;
    yaml += `  selector:\n`;
    yaml += `    app: ${data.name}\n`;
    yaml += `  ports:\n`;
    yaml += `    - protocol: ${data.protocol}\n`;
    yaml += `      port: ${port}\n`;
    yaml += `      targetPort: ${targetPort}\n`;

    if (data.serviceType === 'NodePort' && data.nodePort) {
        yaml += `      nodePort: ${data.nodePort}\n`;
    }

    return yaml;
}

function generateReplicaSet(data) {
    let yaml = `# ReplicaSet: ${data.name}\n`;
    yaml += `apiVersion: apps/v1\n`;
    yaml += `kind: ReplicaSet\n`;
    yaml += generateMetadata(data);
    yaml += `spec:\n`;
    yaml += `  replicas: ${data.replicas}\n`;
    yaml += `  selector:\n`;
    yaml += `    matchLabels:\n`;
    yaml += `      app: ${data.name}\n`;
    yaml += `  template:\n`;
    yaml += `    metadata:\n`;
    yaml += `      labels:\n`;
    yaml += `        app: ${data.name}\n`;
    yaml += `    spec:\n`;
    yaml += generatePodSpec(data, 6);
    return yaml;
}

function generateStatefulSet(data) {
    let yaml = `# StatefulSet: ${data.name}\n`;
    yaml += `apiVersion: apps/v1\n`;
    yaml += `kind: StatefulSet\n`;
    yaml += generateMetadata(data);
    yaml += `spec:\n`;
    yaml += `  serviceName: ${data.name}\n`;
    yaml += `  replicas: ${data.replicas}\n`;
    yaml += `  selector:\n`;
    yaml += `    matchLabels:\n`;
    yaml += `      app: ${data.name}\n`;
    yaml += `  template:\n`;
    yaml += `    metadata:\n`;
    yaml += `      labels:\n`;
    yaml += `        app: ${data.name}\n`;
    yaml += `    spec:\n`;
    yaml += generatePodSpec(data, 6);

    // VolumeClaimTemplates for StatefulSet
    if (data.volumes.some(v => v.type === 'pvc')) {
        yaml += `  volumeClaimTemplates:\n`;
        data.volumes.filter(v => v.type === 'pvc').forEach(vol => {
            yaml += `    - metadata:\n`;
            yaml += `        name: ${vol.name}\n`;
            yaml += `      spec:\n`;
            yaml += `        accessModes: ["ReadWriteOnce"]\n`;
            yaml += `        resources:\n`;
            yaml += `          requests:\n`;
            yaml += `            storage: 1Gi\n`;
        });
    }

    return yaml;
}

function generateDaemonSet(data) {
    let yaml = `# DaemonSet: ${data.name}\n`;
    yaml += `apiVersion: apps/v1\n`;
    yaml += `kind: DaemonSet\n`;
    yaml += generateMetadata(data);
    yaml += `spec:\n`;
    yaml += `  selector:\n`;
    yaml += `    matchLabels:\n`;
    yaml += `      app: ${data.name}\n`;
    yaml += `  template:\n`;
    yaml += `    metadata:\n`;
    yaml += `      labels:\n`;
    yaml += `        app: ${data.name}\n`;
    yaml += `    spec:\n`;
    yaml += generatePodSpec(data, 6);
    return yaml;
}

function generateJob(data) {
    let yaml = `# Job: ${data.name}\n`;
    yaml += `apiVersion: batch/v1\n`;
    yaml += `kind: Job\n`;
    yaml += generateMetadata(data);
    yaml += `spec:\n`;
    yaml += `  template:\n`;
    yaml += `    metadata:\n`;
    yaml += `      labels:\n`;
    yaml += `        app: ${data.name}\n`;
    yaml += `    spec:\n`;
    yaml += `      restartPolicy: ${data.restartPolicy === 'Always' ? 'OnFailure' : data.restartPolicy}\n`;
    yaml += generatePodSpec(data, 6);
    return yaml;
}

function generateCronJob(data) {
    let yaml = `# CronJob: ${data.name}\n`;
    yaml += `apiVersion: batch/v1\n`;
    yaml += `kind: CronJob\n`;
    yaml += generateMetadata(data);
    yaml += `spec:\n`;
    yaml += `  schedule: "${data.cronSchedule}"\n`;
    yaml += `  jobTemplate:\n`;
    yaml += `    spec:\n`;
    yaml += `      template:\n`;
    yaml += `        metadata:\n`;
    yaml += `          labels:\n`;
    yaml += `            app: ${data.name}\n`;
    yaml += `        spec:\n`;
    yaml += `          restartPolicy: ${data.cronRestartPolicy}\n`;
    yaml += generatePodSpec(data, 10);
    return yaml;
}

function generateIngress(data) {
    let yaml = `# Ingress: ${data.name}\n`;
    yaml += `apiVersion: networking.k8s.io/v1\n`;
    yaml += `kind: Ingress\n`;
    yaml += generateMetadata(data);

    // Add ingress class annotation
    if (!yaml.includes('annotations:')) {
        yaml = yaml.replace('  labels:', `  annotations:\n    kubernetes.io/ingress.class: "${data.ingressClass}"\n  labels:`);
    }

    yaml += `spec:\n`;
    yaml += `  ingressClassName: ${data.ingressClass}\n`;

    // TLS
    if (data.tlsSecretName) {
        yaml += `  tls:\n`;
        yaml += `    - hosts:\n`;
        yaml += `        - ${data.ingressHost || 'example.com'}\n`;
        yaml += `      secretName: ${data.tlsSecretName}\n`;
    }

    yaml += `  rules:\n`;
    yaml += `    - host: ${data.ingressHost || 'example.com'}\n`;
    yaml += `      http:\n`;
    yaml += `        paths:\n`;
    yaml += `          - path: ${data.ingressPath}\n`;
    yaml += `            pathType: ${data.pathType}\n`;
    yaml += `            backend:\n`;
    yaml += `              service:\n`;
    yaml += `                name: ${data.name}\n`;
    yaml += `                port:\n`;
    yaml += `                  number: ${data.containerPort || 80}\n`;

    return yaml;
}

function generateConfigMap(data) {
    let yaml = `# ConfigMap: ${data.name}\n`;
    yaml += `apiVersion: v1\n`;
    yaml += `kind: ConfigMap\n`;
    yaml += generateMetadata(data);
    yaml += `data:\n`;

    if (data.envVars.length > 0) {
        data.envVars.forEach(env => {
            yaml += `  ${env.name}: "${env.value}"\n`;
        });
    } else {
        yaml += `  # Add your configuration data here\n`;
        yaml += `  APP_ENV: "production"\n`;
    }

    return yaml;
}

function generateSecret(data) {
    let yaml = `# Secret: ${data.name}\n`;
    yaml += `apiVersion: v1\n`;
    yaml += `kind: Secret\n`;
    yaml += generateMetadata(data);
    yaml += `type: Opaque\n`;
    yaml += `data:\n`;
    yaml += `  # Values must be base64 encoded\n`;
    yaml += `  # Use: echo -n "value" | base64\n`;

    if (data.envVars.length > 0) {
        data.envVars.forEach(env => {
            yaml += `  ${env.name}: ${btoa(env.value)}\n`;
        });
    } else {
        yaml += `  username: YWRtaW4=\n`;
        yaml += `  password: cGFzc3dvcmQ=\n`;
    }

    return yaml;
}

function generatePVC(data) {
    let yaml = `# PersistentVolumeClaim: ${data.name}\n`;
    yaml += `apiVersion: v1\n`;
    yaml += `kind: PersistentVolumeClaim\n`;
    yaml += generateMetadata(data);
    yaml += `spec:\n`;
    yaml += `  accessModes:\n`;
    yaml += `    - ReadWriteOnce\n`;
    yaml += `  resources:\n`;
    yaml += `    requests:\n`;
    yaml += `      storage: 1Gi\n`;
    yaml += `  # storageClassName: standard\n`;
    return yaml;
}

function generateHPA(data) {
    let yaml = `# HorizontalPodAutoscaler: ${data.name}\n`;
    yaml += `apiVersion: autoscaling/v2\n`;
    yaml += `kind: HorizontalPodAutoscaler\n`;
    yaml += generateMetadata(data);
    yaml += `spec:\n`;
    yaml += `  scaleTargetRef:\n`;
    yaml += `    apiVersion: apps/v1\n`;
    yaml += `    kind: Deployment\n`;
    yaml += `    name: ${data.name}\n`;
    yaml += `  minReplicas: ${data.hpaMinReplicas}\n`;
    yaml += `  maxReplicas: ${data.hpaMaxReplicas}\n`;
    yaml += `  metrics:\n`;
    yaml += `    - type: Resource\n`;
    yaml += `      resource:\n`;
    yaml += `        name: cpu\n`;
    yaml += `        target:\n`;
    yaml += `          type: Utilization\n`;
    yaml += `          averageUtilization: ${data.hpaTargetCPU}\n`;
    return yaml;
}

function generateNetworkPolicy(data) {
    let yaml = `# NetworkPolicy: ${data.name}\n`;
    yaml += `apiVersion: networking.k8s.io/v1\n`;
    yaml += `kind: NetworkPolicy\n`;
    yaml += generateMetadata(data);
    yaml += `spec:\n`;
    yaml += `  podSelector:\n`;
    yaml += `    matchLabels:\n`;
    yaml += `      app: ${data.name}\n`;
    yaml += `  policyTypes:\n`;
    yaml += `    - Ingress\n`;
    yaml += `    - Egress\n`;
    yaml += `  ingress:\n`;
    yaml += `    - from:\n`;
    yaml += `        - podSelector:\n`;
    yaml += `            matchLabels:\n`;
    yaml += `              app: ${data.name}\n`;

    if (data.containerPort) {
        yaml += `      ports:\n`;
        yaml += `        - protocol: TCP\n`;
        yaml += `          port: ${data.containerPort}\n`;
    }

    yaml += `  egress:\n`;
    yaml += `    - {}\n`;
    return yaml;
}

// ===== Main Generate Function =====

function generateAllYAML() {
    const data = getFormData();
    const resources = getSelectedResources();
    const results = {};

    if (!data.name || !data.image) {
        return { combined: '# Please fill in the required fields (Docker Image and App Name)', individual: {} };
    }

    const generators = {
        pod: generatePod,
        deployment: generateDeployment,
        service: generateService,
        replicaset: generateReplicaSet,
        statefulset: generateStatefulSet,
        daemonset: generateDaemonSet,
        job: generateJob,
        cronjob: generateCronJob,
        ingress: generateIngress,
        configmap: generateConfigMap,
        secret: generateSecret,
        pvc: generatePVC,
        hpa: generateHPA,
        networkpolicy: generateNetworkPolicy,
    };

    resources.forEach(resource => {
        if (generators[resource]) {
            results[resource] = generators[resource](data);
        }
    });

    const combined = Object.values(results).join('\n---\n\n');

    return { combined, individual: results };
}
