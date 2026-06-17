/**
 * K8s Config Generator - kubectl Command Generation
 * Generates helpful kubectl commands based on selected resources.
 */

function generateKubectlCommands() {
    const data = getFormData();
    const resources = getSelectedResources();

    if (!data.name || !data.image) {
        return '<div class="empty-state">Fill in the required fields to see kubectl commands</div>';
    }

    const ns = data.namespace !== 'default' ? ` -n ${data.namespace}` : '';
    const nsFlag = data.namespace !== 'default' ? ` --namespace=${data.namespace}` : '';
    let html = '';

    // Apply commands
    html += `<div class="kubectl-section">`;
    html += `<h3>Apply Resources</h3>`;
    html += `<span class="kubectl-cmd" onclick="copyCommand(this)">kubectl apply -f ${data.name}.yaml${nsFlag}</span>`;
    resources.forEach(r => {
        const filename = `${data.name}-${r}.yaml`;
        html += `<span class="kubectl-cmd" onclick="copyCommand(this)">kubectl apply -f ${filename}${nsFlag}</span>`;
    });
    html += `</div>`;

    // Get resources
    html += `<div class="kubectl-section">`;
    html += `<h3>Get Resources</h3>`;
    if (resources.includes('pod') || resources.includes('deployment') || resources.includes('statefulset') || resources.includes('daemonset') || resources.includes('replicaset')) {
        html += `<span class="kubectl-cmd" onclick="copyCommand(this)">kubectl get pods -l app=${data.name}${ns}</span>`;
    }
    if (resources.includes('deployment')) {
        html += `<span class="kubectl-cmd" onclick="copyCommand(this)">kubectl get deployment ${data.name}${ns}</span>`;
    }
    if (resources.includes('service')) {
        html += `<span class="kubectl-cmd" onclick="copyCommand(this)">kubectl get service ${data.name}${ns}</span>`;
    }
    if (resources.includes('ingress')) {
        html += `<span class="kubectl-cmd" onclick="copyCommand(this)">kubectl get ingress ${data.name}${ns}</span>`;
    }
    if (resources.includes('statefulset')) {
        html += `<span class="kubectl-cmd" onclick="copyCommand(this)">kubectl get statefulset ${data.name}${ns}</span>`;
    }
    if (resources.includes('daemonset')) {
        html += `<span class="kubectl-cmd" onclick="copyCommand(this)">kubectl get daemonset ${data.name}${ns}</span>`;
    }
    if (resources.includes('job')) {
        html += `<span class="kubectl-cmd" onclick="copyCommand(this)">kubectl get jobs${ns}</span>`;
    }
    if (resources.includes('cronjob')) {
        html += `<span class="kubectl-cmd" onclick="copyCommand(this)">kubectl get cronjobs${ns}</span>`;
    }
    if (resources.includes('configmap')) {
        html += `<span class="kubectl-cmd" onclick="copyCommand(this)">kubectl get configmap ${data.name}${ns}</span>`;
    }
    if (resources.includes('secret')) {
        html += `<span class="kubectl-cmd" onclick="copyCommand(this)">kubectl get secret ${data.name}${ns}</span>`;
    }
    if (resources.includes('pvc')) {
        html += `<span class="kubectl-cmd" onclick="copyCommand(this)">kubectl get pvc ${data.name}${ns}</span>`;
    }
    if (resources.includes('hpa')) {
        html += `<span class="kubectl-cmd" onclick="copyCommand(this)">kubectl get hpa ${data.name}${ns}</span>`;
    }
    if (resources.includes('networkpolicy')) {
        html += `<span class="kubectl-cmd" onclick="copyCommand(this)">kubectl get networkpolicy ${data.name}${ns}</span>`;
    }
    html += `<span class="kubectl-cmd" onclick="copyCommand(this)">kubectl get all -l app=${data.name}${ns}</span>`;
    html += `</div>`;

    // Describe resources
    html += `<div class="kubectl-section">`;
    html += `<h3>Describe Resources</h3>`;
    if (resources.includes('deployment')) {
        html += `<span class="kubectl-cmd" onclick="copyCommand(this)">kubectl describe deployment ${data.name}${ns}</span>`;
    }
    if (resources.includes('service')) {
        html += `<span class="kubectl-cmd" onclick="copyCommand(this)">kubectl describe service ${data.name}${ns}</span>`;
    }
    html += `<span class="kubectl-cmd" onclick="copyCommand(this)">kubectl describe pod -l app=${data.name}${ns}</span>`;
    html += `</div>`;

    // Endpoints
    if (resources.includes('service')) {
        html += `<div class="kubectl-section">`;
        html += `<h3>Endpoints</h3>`;
        html += `<span class="kubectl-cmd" onclick="copyCommand(this)">kubectl get endpoints ${data.name}${ns}</span>`;
        html += `<span class="kubectl-cmd" onclick="copyCommand(this)">kubectl get ep ${data.name}${ns}</span>`;
        html += `</div>`;
    }

    // Port Forwarding
    if (data.containerPort) {
        html += `<div class="kubectl-section">`;
        html += `<h3>Port Forwarding</h3>`;
        if (resources.includes('service')) {
            html += `<span class="kubectl-cmd" onclick="copyCommand(this)">kubectl port-forward --address 0.0.0.0 svc/${data.name} ${data.containerPort}:${data.containerPort}${ns}</span>`;
        }
        html += `<span class="kubectl-cmd" onclick="copyCommand(this)">kubectl port-forward --address 0.0.0.0 deploy/${data.name} ${data.containerPort}:${data.containerPort}${ns}</span>`;
        html += `</div>`;
    }

    // Logs
    html += `<div class="kubectl-section">`;
    html += `<h3>Logs</h3>`;
    html += `<span class="kubectl-cmd" onclick="copyCommand(this)">kubectl logs -l app=${data.name}${ns}</span>`;
    html += `<span class="kubectl-cmd" onclick="copyCommand(this)">kubectl logs -l app=${data.name} --tail=100 -f${ns}</span>`;
    html += `<span class="kubectl-cmd" onclick="copyCommand(this)">kubectl logs -l app=${data.name} --previous${ns}</span>`;
    html += `</div>`;

    // Exec into pod
    html += `<div class="kubectl-section">`;
    html += `<h3>Exec into Pod</h3>`;
    html += `<span class="kubectl-cmd" onclick="copyCommand(this)">kubectl exec -it deploy/${data.name}${ns} -- /bin/sh</span>`;
    html += `<span class="kubectl-cmd" onclick="copyCommand(this)">kubectl exec -it deploy/${data.name}${ns} -- /bin/bash</span>`;
    html += `</div>`;

    // Rollout
    if (resources.includes('deployment') || resources.includes('statefulset') || resources.includes('daemonset')) {
        html += `<div class="kubectl-section">`;
        html += `<h3>Rollout Management</h3>`;
        if (resources.includes('deployment')) {
            html += `<span class="kubectl-cmd" onclick="copyCommand(this)">kubectl rollout status deployment/${data.name}${ns}</span>`;
            html += `<span class="kubectl-cmd" onclick="copyCommand(this)">kubectl rollout history deployment/${data.name}${ns}</span>`;
            html += `<span class="kubectl-cmd" onclick="copyCommand(this)">kubectl rollout undo deployment/${data.name}${ns}</span>`;
            html += `<span class="kubectl-cmd" onclick="copyCommand(this)">kubectl rollout restart deployment/${data.name}${ns}</span>`;
        }
        if (resources.includes('statefulset')) {
            html += `<span class="kubectl-cmd" onclick="copyCommand(this)">kubectl rollout status statefulset/${data.name}${ns}</span>`;
        }
        if (resources.includes('daemonset')) {
            html += `<span class="kubectl-cmd" onclick="copyCommand(this)">kubectl rollout status daemonset/${data.name}${ns}</span>`;
        }
        html += `</div>`;
    }

    // Scale
    if (resources.includes('deployment') || resources.includes('replicaset') || resources.includes('statefulset')) {
        html += `<div class="kubectl-section">`;
        html += `<h3>Scaling</h3>`;
        if (resources.includes('deployment')) {
            html += `<span class="kubectl-cmd" onclick="copyCommand(this)">kubectl scale deployment/${data.name} --replicas=3${ns}</span>`;
        }
        if (resources.includes('statefulset')) {
            html += `<span class="kubectl-cmd" onclick="copyCommand(this)">kubectl scale statefulset/${data.name} --replicas=3${ns}</span>`;
        }
        if (resources.includes('replicaset')) {
            html += `<span class="kubectl-cmd" onclick="copyCommand(this)">kubectl scale replicaset/${data.name} --replicas=3${ns}</span>`;
        }
        html += `</div>`;
    }

    // Delete resources
    html += `<div class="kubectl-section">`;
    html += `<h3>Delete Resources</h3>`;
    html += `<span class="kubectl-cmd" onclick="copyCommand(this)">kubectl delete -f ${data.name}.yaml${nsFlag}</span>`;
    resources.forEach(r => {
        const resourceNames = {
            pod: 'pod', deployment: 'deployment', service: 'service',
            replicaset: 'replicaset', statefulset: 'statefulset',
            daemonset: 'daemonset', job: 'job', cronjob: 'cronjob',
            ingress: 'ingress', configmap: 'configmap', secret: 'secret',
            pvc: 'pvc', hpa: 'hpa', networkpolicy: 'networkpolicy'
        };
        html += `<span class="kubectl-cmd" onclick="copyCommand(this)">kubectl delete ${resourceNames[r]} ${data.name}${ns}</span>`;
    });
    html += `</div>`;

    // Debugging
    html += `<div class="kubectl-section">`;
    html += `<h3>Debugging</h3>`;
    html += `<span class="kubectl-cmd" onclick="copyCommand(this)">kubectl get events --sort-by='.lastTimestamp'${ns}</span>`;
    html += `<span class="kubectl-cmd" onclick="copyCommand(this)">kubectl top pods -l app=${data.name}${ns}</span>`;
    html += `<span class="kubectl-cmd" onclick="copyCommand(this)">kubectl get pods -l app=${data.name} -o wide${ns}</span>`;
    html += `</div>`;

    // Practice Playgrounds
    html += `<div class="kubectl-section">`;
    html += `<h3>Practice Playgrounds</h3>`;
    html += `<p style="color: var(--text-secondary); font-size: 0.82rem; margin-bottom: 10px;">Try your generated configs on these free Kubernetes playgrounds:</p>`;
    html += `<a href="https://killercoda.com/playgrounds/scenario/kubernetes" target="_blank" rel="noopener noreferrer" class="playground-btn killercoda-btn">☸ Practice on KillerCoda</a>`;
    html += `<a href="https://cloudkida.com/" target="_blank" rel="noopener noreferrer" class="playground-btn cloudkida-btn">☁ Practice on CloudKida</a>`;
    html += `</div>`;

    return html;
}

function copyCommand(element) {
    const text = element.textContent;
    navigator.clipboard.writeText(text).then(() => {
        showToast('Command copied to clipboard');
    });
}
