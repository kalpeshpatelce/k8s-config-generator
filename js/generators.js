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
        // Startup Probe
        startupType: document.getElementById('startupType').value,
        startupPath: document.getElementById('startupPath').value.trim(),
        startupPort: parseInt(document.getElementById('startupPort').value) || null,
        startupFailureThreshold: parseInt(document.getElementById('startupFailureThreshold').value) || 30,
        startupPeriod: parseInt(document.getElementById('startupPeriod').value) || 10,
        // CronJob
        cronSchedule: document.getElementById('cronSchedule').value.trim() || '*/5 * * * *',
        cronRestartPolicy: document.getElementById('cronRestartPolicy').value,
        // HPA
        hpaMinReplicas: parseInt(document.getElementById('hpaMinReplicas').value) || 1,
        hpaMaxReplicas: parseInt(document.getElementById('hpaMaxReplicas').value) || 10,
        hpaTargetCPU: parseInt(document.getElementById('hpaTargetCPU').value) || 80,
        hpaTargetMemory: parseInt(document.getElementById('hpaTargetMemory').value) || null,
        hpaScaleDownStabilization: parseInt(document.getElementById('hpaScaleDownStabilization').value) || null,
        // Advanced
        imagePullPolicy: document.getElementById('imagePullPolicy').value,
        restartPolicy: document.getElementById('restartPolicy').value,
        serviceAccountName: document.getElementById('serviceAccountName').value.trim(),
        nodeSelector: parseKeyValue(document.getElementById('nodeSelector').value),
        tolerations: document.getElementById('tolerations').value.trim(),
        annotations: parseKeyValue(document.getElementById('annotations').value),
        // Strategy
        strategyType: document.getElementById('strategyType').value,
        maxSurge: document.getElementById('maxSurge').value.trim() || '25%',
        maxUnavailable: document.getElementById('maxUnavailable').value.trim() || '25%',
        minReadySeconds: parseInt(document.getElementById('minReadySeconds').value) || 0,
        revisionHistoryLimit: parseInt(document.getElementById('revisionHistoryLimit').value) || 10,
        progressDeadlineSeconds: parseInt(document.getElementById('progressDeadlineSeconds').value) || 600,
        // Security Context
        runAsUser: document.getElementById('runAsUser').value.trim(),
        runAsGroup: document.getElementById('runAsGroup').value.trim(),
        fsGroup: document.getElementById('fsGroup').value.trim(),
        runAsNonRoot: document.getElementById('runAsNonRoot').value,
        readOnlyRootFS: document.getElementById('readOnlyRootFS').value,
        privileged: document.getElementById('privileged').value,
        capabilities: document.getElementById('capabilities').value.trim(),
        dropCapabilities: document.getElementById('dropCapabilities').value.trim(),
        // PV
        pvCapacity: document.getElementById('pvCapacity').value.trim() || '10Gi',
        pvAccessMode: document.getElementById('pvAccessMode').value,
        pvReclaimPolicy: document.getElementById('pvReclaimPolicy').value,
        pvStorageClass: document.getElementById('pvStorageClass').value.trim(),
        pvHostPath: document.getElementById('pvHostPath').value.trim(),
        pvNfsServer: document.getElementById('pvNfsServer').value.trim(),
        pvNfsPath: document.getElementById('pvNfsPath').value.trim(),
        // StorageClass
        scProvisioner: document.getElementById('scProvisioner').value,
        scReclaimPolicy: document.getElementById('scReclaimPolicy').value,
        scVolumeBindingMode: document.getElementById('scVolumeBindingMode').value,
        scAllowExpansion: document.getElementById('scAllowExpansion').value,
        // RBAC
        rbacApiGroups: document.getElementById('rbacApiGroups').value.trim(),
        rbacResources: document.getElementById('rbacResources').value.trim(),
        rbacVerbs: document.getElementById('rbacVerbs').value.trim(),
        rbacSubjectKind: document.getElementById('rbacSubjectKind').value,
        rbacSubjectName: document.getElementById('rbacSubjectName').value.trim(),
        // PDB
        pdbMinAvailable: document.getElementById('pdbMinAvailable').value.trim(),
        pdbMaxUnavailable: document.getElementById('pdbMaxUnavailable').value.trim(),
        // LimitRange
        lrType: document.getElementById('lrType').value,
        lrDefaultCPU: document.getElementById('lrDefaultCPU').value.trim(),
        lrDefaultMemory: document.getElementById('lrDefaultMemory').value.trim(),
        lrDefaultRequestCPU: document.getElementById('lrDefaultRequestCPU').value.trim(),
        lrDefaultRequestMemory: document.getElementById('lrDefaultRequestMemory').value.trim(),
        lrMaxCPU: document.getElementById('lrMaxCPU').value.trim(),
        lrMaxMemory: document.getElementById('lrMaxMemory').value.trim(),
        lrMinCPU: document.getElementById('lrMinCPU').value.trim(),
        lrMinMemory: document.getElementById('lrMinMemory').value.trim(),
        // ResourceQuota
        rqCPURequests: document.getElementById('rqCPURequests').value.trim(),
        rqCPULimits: document.getElementById('rqCPULimits').value.trim(),
        rqMemoryRequests: document.getElementById('rqMemoryRequests').value.trim(),
        rqMemoryLimits: document.getElementById('rqMemoryLimits').value.trim(),
        rqPods: document.getElementById('rqPods').value.trim(),
        rqServices: document.getElementById('rqServices').value.trim(),
        rqConfigMaps: document.getElementById('rqConfigMaps').value.trim(),
        rqSecrets: document.getElementById('rqSecrets').value.trim(),
        rqPVCs: document.getElementById('rqPVCs').value.trim(),
        // PriorityClass
        pcValue: parseInt(document.getElementById('pcValue').value) || 1000000,
        pcGlobalDefault: document.getElementById('pcGlobalDefault').value,
        pcPreemptionPolicy: document.getElementById('pcPreemptionPolicy').value,
        pcDescription: document.getElementById('pcDescription').value.trim(),
        // Endpoints
        epIP: document.getElementById('epIP').value.trim(),
        epPort: parseInt(document.getElementById('epPort').value) || null,
        epPortName: document.getElementById('epPortName').value.trim(),
        // Dynamic
        envVars: getEnvVars(),
        volumes: getVolumes(),
        initContainers: getInitContainers(),
    };

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

function getInitContainers() {
    const rows = document.querySelectorAll('.init-container-row');
    const containers = [];
    rows.forEach(row => {
        const name = row.querySelector('.init-name').value.trim();
        const image = row.querySelector('.init-image').value.trim();
        const command = row.querySelector('.init-command').value.trim();
        if (name && image) {
            containers.push({ name, image, command });
        }
    });
    return containers;
}

function getSelectedResources() {
    const checkboxes = document.querySelectorAll('input[name="resourceType"]:checked');
    return Array.from(checkboxes).map(cb => cb.value);
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

// ===== Security Context Block =====

function generateSecurityContext(data, indentLevel) {
    const pad = ' '.repeat(indentLevel);
    let yaml = '';
    const hasPodSecurity = data.runAsUser || data.runAsGroup || data.fsGroup || data.runAsNonRoot;
    const hasContainerSecurity = data.readOnlyRootFS || data.privileged || data.capabilities || data.dropCapabilities;

    if (hasPodSecurity) {
        yaml += `${pad}securityContext:\n`;
        if (data.runAsUser) yaml += `${pad}  runAsUser: ${data.runAsUser}\n`;
        if (data.runAsGroup) yaml += `${pad}  runAsGroup: ${data.runAsGroup}\n`;
        if (data.fsGroup) yaml += `${pad}  fsGroup: ${data.fsGroup}\n`;
        if (data.runAsNonRoot) yaml += `${pad}  runAsNonRoot: ${data.runAsNonRoot}\n`;
    }

    return { podSecurity: yaml, hasContainerSecurity };
}

function generateContainerSecurityContext(data, indentLevel) {
    const pad = ' '.repeat(indentLevel);
    let yaml = '';
    if (!data.readOnlyRootFS && !data.privileged && !data.capabilities && !data.dropCapabilities) return '';

    yaml += `${pad}securityContext:\n`;
    if (data.readOnlyRootFS) yaml += `${pad}  readOnlyRootFilesystem: ${data.readOnlyRootFS}\n`;
    if (data.privileged) yaml += `${pad}  privileged: ${data.privileged}\n`;
    if (data.capabilities || data.dropCapabilities) {
        yaml += `${pad}  capabilities:\n`;
        if (data.capabilities) {
            yaml += `${pad}    add:\n`;
            data.capabilities.split(',').map(c => c.trim()).forEach(cap => {
                yaml += `${pad}      - ${cap}\n`;
            });
        }
        if (data.dropCapabilities) {
            yaml += `${pad}    drop:\n`;
            data.dropCapabilities.split(',').map(c => c.trim()).forEach(cap => {
                yaml += `${pad}      - ${cap}\n`;
            });
        }
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

    // Container security context
    yaml += generateContainerSecurityContext(data, indentLevel + 4);

    // Liveness probe
    if (data.livenessType) {
        yaml += generateProbe(data, 'liveness', indentLevel + 4);
    }

    // Readiness probe
    if (data.readinessType) {
        yaml += generateProbe(data, 'readiness', indentLevel + 4);
    }

    // Startup probe
    if (data.startupType) {
        yaml += generateStartupProbe(data, indentLevel + 4);
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

function generateStartupProbe(data, indentLevel) {
    const pad = ' '.repeat(indentLevel);
    const port = data.startupPort || data.containerPort || 80;

    let yaml = `${pad}startupProbe:\n`;

    if (data.startupType === 'httpGet') {
        yaml += `${pad}  httpGet:\n`;
        yaml += `${pad}    path: ${data.startupPath || '/healthz'}\n`;
        yaml += `${pad}    port: ${port}\n`;
    } else if (data.startupType === 'tcpSocket') {
        yaml += `${pad}  tcpSocket:\n`;
        yaml += `${pad}    port: ${port}\n`;
    } else if (data.startupType === 'exec') {
        yaml += `${pad}  exec:\n`;
        yaml += `${pad}    command:\n`;
        yaml += `${pad}      - /bin/sh\n`;
        yaml += `${pad}      - -c\n`;
        yaml += `${pad}      - "echo healthy"\n`;
    }

    yaml += `${pad}  failureThreshold: ${data.startupFailureThreshold}\n`;
    yaml += `${pad}  periodSeconds: ${data.startupPeriod}\n`;

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

// ===== Init Containers Block =====

function generateInitContainers(data, indentLevel) {
    if (data.initContainers.length === 0) return '';

    const pad = ' '.repeat(indentLevel);
    let yaml = `${pad}initContainers:\n`;

    data.initContainers.forEach(ic => {
        yaml += `${pad}  - name: ${ic.name}\n`;
        yaml += `${pad}    image: ${ic.image}\n`;
        if (ic.command) {
            yaml += `${pad}    command:\n`;
            ic.command.split(',').map(c => c.trim()).forEach(cmd => {
                yaml += `${pad}      - "${cmd}"\n`;
            });
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

    // Pod security context
    const { podSecurity } = generateSecurityContext(data, indentLevel);
    yaml += podSecurity;

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

    // Init containers
    yaml += generateInitContainers(data, indentLevel);

    yaml += generateContainerSpec(data, indentLevel);
    yaml += generateVolumeSpec(data, indentLevel);

    return yaml;
}

// ===== Resource Generators =====

function generateNamespace(data) {
    let yaml = `# Namespace: ${data.namespace}\n`;
    yaml += `apiVersion: v1\n`;
    yaml += `kind: Namespace\n`;
    yaml += `metadata:\n`;
    yaml += `  name: ${data.namespace}\n`;
    const allLabels = { 'kubernetes.io/metadata.name': data.namespace, ...data.labels };
    yaml += `  labels:\n`;
    Object.entries(allLabels).forEach(([key, value]) => {
        yaml += `    ${key}: "${value}"\n`;
    });
    return yaml;
}

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
    yaml += `  revisionHistoryLimit: ${data.revisionHistoryLimit}\n`;
    yaml += `  progressDeadlineSeconds: ${data.progressDeadlineSeconds}\n`;
    yaml += `  minReadySeconds: ${data.minReadySeconds}\n`;
    yaml += `  strategy:\n`;
    yaml += `    type: ${data.strategyType}\n`;
    if (data.strategyType === 'RollingUpdate') {
        yaml += `    rollingUpdate:\n`;
        yaml += `      maxSurge: ${data.maxSurge}\n`;
        yaml += `      maxUnavailable: ${data.maxUnavailable}\n`;
    }
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
    yaml += `      name: http\n`;
    if (data.serviceType === 'LoadBalancer') {
        yaml += `  # externalTrafficPolicy: Local\n`;
        yaml += `  # loadBalancerSourceRanges:\n`;
        yaml += `  #   - 0.0.0.0/0\n`;
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
    yaml += `  podManagementPolicy: OrderedReady\n`;
    yaml += `  updateStrategy:\n`;
    yaml += `    type: RollingUpdate\n`;
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
    yaml += `  updateStrategy:\n`;
    yaml += `    type: RollingUpdate\n`;
    yaml += `    rollingUpdate:\n`;
    yaml += `      maxUnavailable: 1\n`;
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
    yaml += `  backoffLimit: 4\n`;
    yaml += `  activeDeadlineSeconds: 600\n`;
    yaml += `  ttlSecondsAfterFinished: 100\n`;
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
    yaml += `  concurrencyPolicy: Forbid\n`;
    yaml += `  successfulJobsHistoryLimit: 3\n`;
    yaml += `  failedJobsHistoryLimit: 1\n`;
    yaml += `  startingDeadlineSeconds: 200\n`;
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

    if (!yaml.includes('annotations:')) {
        yaml = yaml.replace('  labels:', `  annotations:\n    kubernetes.io/ingress.class: "${data.ingressClass}"\n  labels:`);
    }

    yaml += `spec:\n`;
    yaml += `  ingressClassName: ${data.ingressClass}\n`;

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
    yaml += `    - ${data.pvAccessMode || 'ReadWriteOnce'}\n`;
    yaml += `  resources:\n`;
    yaml += `    requests:\n`;
    yaml += `      storage: ${data.pvCapacity || '1Gi'}\n`;
    if (data.pvStorageClass) {
        yaml += `  storageClassName: ${data.pvStorageClass}\n`;
    }
    return yaml;
}

function generatePV(data) {
    let yaml = `# PersistentVolume: ${data.name}-pv\n`;
    yaml += `apiVersion: v1\n`;
    yaml += `kind: PersistentVolume\n`;
    yaml += `metadata:\n`;
    yaml += `  name: ${data.name}-pv\n`;
    yaml += `  labels:\n`;
    yaml += `    app: "${data.name}"\n`;
    yaml += `spec:\n`;
    yaml += `  capacity:\n`;
    yaml += `    storage: ${data.pvCapacity}\n`;
    yaml += `  accessModes:\n`;
    yaml += `    - ${data.pvAccessMode}\n`;
    yaml += `  persistentVolumeReclaimPolicy: ${data.pvReclaimPolicy}\n`;
    if (data.pvStorageClass) {
        yaml += `  storageClassName: ${data.pvStorageClass}\n`;
    }
    if (data.pvNfsServer && data.pvNfsPath) {
        yaml += `  nfs:\n`;
        yaml += `    server: ${data.pvNfsServer}\n`;
        yaml += `    path: ${data.pvNfsPath}\n`;
    } else if (data.pvHostPath) {
        yaml += `  hostPath:\n`;
        yaml += `    path: ${data.pvHostPath}\n`;
        yaml += `    type: DirectoryOrCreate\n`;
    }
    return yaml;
}

function generateStorageClass(data) {
    let yaml = `# StorageClass: ${data.name}-sc\n`;
    yaml += `apiVersion: storage.k8s.io/v1\n`;
    yaml += `kind: StorageClass\n`;
    yaml += `metadata:\n`;
    yaml += `  name: ${data.name}-sc\n`;
    yaml += `provisioner: ${data.scProvisioner}\n`;
    yaml += `reclaimPolicy: ${data.scReclaimPolicy}\n`;
    yaml += `volumeBindingMode: ${data.scVolumeBindingMode}\n`;
    yaml += `allowVolumeExpansion: ${data.scAllowExpansion}\n`;
    yaml += `parameters:\n`;
    if (data.scProvisioner.includes('aws') || data.scProvisioner.includes('ebs')) {
        yaml += `  type: gp3\n`;
        yaml += `  fsType: ext4\n`;
    } else if (data.scProvisioner.includes('gce') || data.scProvisioner.includes('gke')) {
        yaml += `  type: pd-standard\n`;
    } else if (data.scProvisioner.includes('azure')) {
        yaml += `  storageaccounttype: Standard_LRS\n`;
        yaml += `  kind: Managed\n`;
    }
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
    if (data.hpaTargetMemory) {
        yaml += `    - type: Resource\n`;
        yaml += `      resource:\n`;
        yaml += `        name: memory\n`;
        yaml += `        target:\n`;
        yaml += `          type: Utilization\n`;
        yaml += `          averageUtilization: ${data.hpaTargetMemory}\n`;
    }
    if (data.hpaScaleDownStabilization) {
        yaml += `  behavior:\n`;
        yaml += `    scaleDown:\n`;
        yaml += `      stabilizationWindowSeconds: ${data.hpaScaleDownStabilization}\n`;
    }
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

function generateServiceAccount(data) {
    let yaml = `# ServiceAccount: ${data.name}\n`;
    yaml += `apiVersion: v1\n`;
    yaml += `kind: ServiceAccount\n`;
    yaml += generateMetadata(data);
    yaml += `automountServiceAccountToken: true\n`;
    return yaml;
}

function generateRole(data) {
    const apiGroups = data.rbacApiGroups ? data.rbacApiGroups.split(',').map(g => g.trim()) : ['""'];
    const resources = data.rbacResources ? data.rbacResources.split(',').map(r => r.trim()) : ['pods'];
    const verbs = data.rbacVerbs ? data.rbacVerbs.split(',').map(v => v.trim()) : ['get', 'list', 'watch'];

    let yaml = `# Role: ${data.name}\n`;
    yaml += `apiVersion: rbac.authorization.k8s.io/v1\n`;
    yaml += `kind: Role\n`;
    yaml += generateMetadata(data);
    yaml += `rules:\n`;
    yaml += `  - apiGroups:\n`;
    apiGroups.forEach(g => {
        yaml += `      - "${g}"\n`;
    });
    yaml += `    resources:\n`;
    resources.forEach(r => {
        yaml += `      - "${r}"\n`;
    });
    yaml += `    verbs:\n`;
    verbs.forEach(v => {
        yaml += `      - "${v}"\n`;
    });
    return yaml;
}

function generateRoleBinding(data) {
    let yaml = `# RoleBinding: ${data.name}\n`;
    yaml += `apiVersion: rbac.authorization.k8s.io/v1\n`;
    yaml += `kind: RoleBinding\n`;
    yaml += generateMetadata(data);
    yaml += `subjects:\n`;
    yaml += `  - kind: ${data.rbacSubjectKind}\n`;
    yaml += `    name: ${data.rbacSubjectName || data.name}\n`;
    yaml += `    namespace: ${data.namespace}\n`;
    yaml += `roleRef:\n`;
    yaml += `  kind: Role\n`;
    yaml += `  name: ${data.name}\n`;
    yaml += `  apiGroup: rbac.authorization.k8s.io\n`;
    return yaml;
}

function generateClusterRole(data) {
    const apiGroups = data.rbacApiGroups ? data.rbacApiGroups.split(',').map(g => g.trim()) : ['""'];
    const resources = data.rbacResources ? data.rbacResources.split(',').map(r => r.trim()) : ['pods'];
    const verbs = data.rbacVerbs ? data.rbacVerbs.split(',').map(v => v.trim()) : ['get', 'list', 'watch'];

    let yaml = `# ClusterRole: ${data.name}\n`;
    yaml += `apiVersion: rbac.authorization.k8s.io/v1\n`;
    yaml += `kind: ClusterRole\n`;
    yaml += `metadata:\n`;
    yaml += `  name: ${data.name}\n`;
    yaml += `  labels:\n`;
    yaml += `    app: "${data.name}"\n`;
    yaml += `rules:\n`;
    yaml += `  - apiGroups:\n`;
    apiGroups.forEach(g => {
        yaml += `      - "${g}"\n`;
    });
    yaml += `    resources:\n`;
    resources.forEach(r => {
        yaml += `      - "${r}"\n`;
    });
    yaml += `    verbs:\n`;
    verbs.forEach(v => {
        yaml += `      - "${v}"\n`;
    });
    return yaml;
}

function generateClusterRoleBinding(data) {
    let yaml = `# ClusterRoleBinding: ${data.name}\n`;
    yaml += `apiVersion: rbac.authorization.k8s.io/v1\n`;
    yaml += `kind: ClusterRoleBinding\n`;
    yaml += `metadata:\n`;
    yaml += `  name: ${data.name}\n`;
    yaml += `  labels:\n`;
    yaml += `    app: "${data.name}"\n`;
    yaml += `subjects:\n`;
    yaml += `  - kind: ${data.rbacSubjectKind}\n`;
    yaml += `    name: ${data.rbacSubjectName || data.name}\n`;
    yaml += `    namespace: ${data.namespace}\n`;
    yaml += `roleRef:\n`;
    yaml += `  kind: ClusterRole\n`;
    yaml += `  name: ${data.name}\n`;
    yaml += `  apiGroup: rbac.authorization.k8s.io\n`;
    return yaml;
}

function generateLimitRange(data) {
    let yaml = `# LimitRange: ${data.name}\n`;
    yaml += `apiVersion: v1\n`;
    yaml += `kind: LimitRange\n`;
    yaml += generateMetadata(data);
    yaml += `spec:\n`;
    yaml += `  limits:\n`;
    yaml += `    - type: ${data.lrType}\n`;
    if (data.lrDefaultCPU || data.lrDefaultMemory) {
        yaml += `      default:\n`;
        if (data.lrDefaultCPU) yaml += `        cpu: "${data.lrDefaultCPU}"\n`;
        if (data.lrDefaultMemory) yaml += `        memory: "${data.lrDefaultMemory}"\n`;
    }
    if (data.lrDefaultRequestCPU || data.lrDefaultRequestMemory) {
        yaml += `      defaultRequest:\n`;
        if (data.lrDefaultRequestCPU) yaml += `        cpu: "${data.lrDefaultRequestCPU}"\n`;
        if (data.lrDefaultRequestMemory) yaml += `        memory: "${data.lrDefaultRequestMemory}"\n`;
    }
    if (data.lrMaxCPU || data.lrMaxMemory) {
        yaml += `      max:\n`;
        if (data.lrMaxCPU) yaml += `        cpu: "${data.lrMaxCPU}"\n`;
        if (data.lrMaxMemory) yaml += `        memory: "${data.lrMaxMemory}"\n`;
    }
    if (data.lrMinCPU || data.lrMinMemory) {
        yaml += `      min:\n`;
        if (data.lrMinCPU) yaml += `        cpu: "${data.lrMinCPU}"\n`;
        if (data.lrMinMemory) yaml += `        memory: "${data.lrMinMemory}"\n`;
    }
    return yaml;
}

function generateResourceQuota(data) {
    let yaml = `# ResourceQuota: ${data.name}\n`;
    yaml += `apiVersion: v1\n`;
    yaml += `kind: ResourceQuota\n`;
    yaml += generateMetadata(data);
    yaml += `spec:\n`;
    yaml += `  hard:\n`;
    if (data.rqCPURequests) yaml += `    requests.cpu: "${data.rqCPURequests}"\n`;
    if (data.rqCPULimits) yaml += `    limits.cpu: "${data.rqCPULimits}"\n`;
    if (data.rqMemoryRequests) yaml += `    requests.memory: "${data.rqMemoryRequests}"\n`;
    if (data.rqMemoryLimits) yaml += `    limits.memory: "${data.rqMemoryLimits}"\n`;
    if (data.rqPods) yaml += `    pods: "${data.rqPods}"\n`;
    if (data.rqServices) yaml += `    services: "${data.rqServices}"\n`;
    if (data.rqConfigMaps) yaml += `    configmaps: "${data.rqConfigMaps}"\n`;
    if (data.rqSecrets) yaml += `    secrets: "${data.rqSecrets}"\n`;
    if (data.rqPVCs) yaml += `    persistentvolumeclaims: "${data.rqPVCs}"\n`;
    return yaml;
}

function generatePDB(data) {
    let yaml = `# PodDisruptionBudget: ${data.name}\n`;
    yaml += `apiVersion: policy/v1\n`;
    yaml += `kind: PodDisruptionBudget\n`;
    yaml += generateMetadata(data);
    yaml += `spec:\n`;
    if (data.pdbMinAvailable) {
        yaml += `  minAvailable: ${data.pdbMinAvailable}\n`;
    } else if (data.pdbMaxUnavailable) {
        yaml += `  maxUnavailable: ${data.pdbMaxUnavailable}\n`;
    } else {
        yaml += `  minAvailable: 1\n`;
    }
    yaml += `  selector:\n`;
    yaml += `    matchLabels:\n`;
    yaml += `      app: ${data.name}\n`;
    return yaml;
}

function generatePriorityClass(data) {
    let yaml = `# PriorityClass: ${data.name}\n`;
    yaml += `apiVersion: scheduling.k8s.io/v1\n`;
    yaml += `kind: PriorityClass\n`;
    yaml += `metadata:\n`;
    yaml += `  name: ${data.name}\n`;
    yaml += `value: ${data.pcValue}\n`;
    yaml += `globalDefault: ${data.pcGlobalDefault}\n`;
    yaml += `preemptionPolicy: ${data.pcPreemptionPolicy}\n`;
    if (data.pcDescription) {
        yaml += `description: "${data.pcDescription}"\n`;
    }
    return yaml;
}

function generateEndpoints(data) {
    let yaml = `# Endpoints: ${data.name}\n`;
    yaml += `apiVersion: v1\n`;
    yaml += `kind: Endpoints\n`;
    yaml += generateMetadata(data);
    yaml += `subsets:\n`;
    yaml += `  - addresses:\n`;
    yaml += `      - ip: ${data.epIP || '10.0.0.1'}\n`;
    if (data.epPort) {
        yaml += `    ports:\n`;
        yaml += `      - port: ${data.epPort}\n`;
        if (data.epPortName) {
            yaml += `        name: ${data.epPortName}\n`;
        }
        yaml += `        protocol: TCP\n`;
    }
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
        namespace: generateNamespace,
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
        pv: generatePV,
        storageclass: generateStorageClass,
        hpa: generateHPA,
        networkpolicy: generateNetworkPolicy,
        serviceaccount: generateServiceAccount,
        role: generateRole,
        rolebinding: generateRoleBinding,
        clusterrole: generateClusterRole,
        clusterrolebinding: generateClusterRoleBinding,
        limitrange: generateLimitRange,
        resourcequota: generateResourceQuota,
        pdb: generatePDB,
        priorityclass: generatePriorityClass,
        endpoints: generateEndpoints,
    };

    resources.forEach(resource => {
        if (generators[resource]) {
            results[resource] = generators[resource](data);
        }
    });

    const combined = Object.values(results).join('\n---\n\n');

    return { combined, individual: results };
}
