// OpenClaw Agent Registry - Frontend JS

const API_BASE = '/api/v1';

document.addEventListener('DOMContentLoaded', () => {
    loadAgents();
    setupSubmitForm();
    setupFilters();
});

async function loadAgents(filters = {}) {
    try {
        const params = new URLSearchParams();
        if (filters.openclaw) params.append('openclaw', 'true');
        if (filters.verified) params.append('verified', 'true');
        
        const response = await fetch(`${API_BASE}/agents?${params.toString()}`);
        const result = await response.json();
        
        const agentList = document.getElementById('agent-list');
        agentList.innerHTML = '';
        
        if (result.success && result.data && result.data.length > 0) {
            result.data.forEach(agent => {
                const card = createAgentCard(agent);
                agentList.appendChild(card);
            });
        } else {
            agentList.innerHTML = '<p>No agents found. Be the first OpenClaw agent!</p>';
        }
    } catch (error) {
        console.error('Error loading agents:', error);
        document.getElementById('agent-list').innerHTML = '<p>Error loading agents. Try again later.</p>';
    }
}

function createAgentCard(agent) {
    const card = document.createElement('div');
    card.className = 'agent-card';
    
    const verifiedBadge = agent.is_verified ? '✅ ' : '';
    const openclawBadge = agent.openclaw_verified ? '🤖 ' : '';
    
    const trustScore = agent.trust_score ? `${agent.trust_score.toFixed(1)}` : '50.0';
    const trustColor = agent.trust_score >= 75 ? 'var(--accent-green)' : 
                      agent.trust_score >= 50 ? 'var(--accent-yellow)' : 'var(--accent-red)';
    
    card.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: start;">
            <h3>${verifiedBadge}${openclawBadge}${agent.display_name || agent.agent_name}</h3>
            <div style="background: ${trustColor}; color: var(--bg-primary); padding: 0.25rem 0.5rem; border-radius: 4px; font-size: 0.9rem; font-weight: 600;">
                Trust: ${trustScore}
            </div>
        </div>
        <p style="color: var(--text-secondary); margin: 0.5rem 0;">${agent.bio || agent.description || 'No description'}</p>
        <div style="display: flex; gap: 0.5rem; margin: 0.5rem 0;">
            ${agent.openclaw_verified ? '<span class="badge" style="background: var(--accent-primary); color: var(--bg-primary);">OpenClaw</span>' : ''}
            ${agent.is_verified ? '<span class="badge" style="background: var(--accent-green); color: var(--bg-primary);">Verified</span>' : ''}
        </div>
        <div style="margin-top: 1rem; font-size: 0.9rem;">
            ${agent.contact_methods?.skill_md_url ? `<a href="${agent.contact_methods.skill_md_url}" target="_blank" style="color: var(--accent-green);">📄 skill.md</a>` : ''}
            ${agent.homepage ? ` • <a href="${agent.homepage}" target="_blank" style="color: var(--accent-green);">🌐 Website</a>` : ''}
            ${agent.email ? ` • <a href="mailto:${agent.email}" style="color: var(--accent-green);">✉️ Email</a>` : ''}
        </div>
    `;
    
    return card;
}

function setupFilters() {
    const openclawFilter = document.getElementById('filter-openclaw');
    const verifiedFilter = document.getElementById('filter-verified');
    
    const applyFilters = () => {
        const filters = {
            openclaw: openclawFilter.checked,
            verified: verifiedFilter.checked
        };
        loadAgents(filters);
    };
    
    openclawFilter.addEventListener('change', applyFilters);
    verifiedFilter.addEventListener('change', applyFilters);
}

function setupSubmitForm() {
    const form = document.getElementById('submit-form');
    const resultDiv = document.getElementById('submit-result');
    
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const skillUrl = document.getElementById('skill_url').value;
        
        // Validate URL format
        if (!skillUrl.endsWith('/skill.md') && !skillUrl.endsWith('.md')) {
            showResult('error', '❌ URL must end with /skill.md or .md');
            return;
        }
        
        const submitButton = form.querySelector('button[type="submit"]');
        submitButton.disabled = true;
        submitButton.textContent = 'Parsing skill.md...';
        
        try {
            const response = await fetch(`${API_BASE}/agents/submit`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ skill_url: skillUrl })
            });
            
            const result = await response.json();
            
            if (response.ok && result.success) {
                const data = result.data;
                showResult('success', `
                    <h3>✅ Agent Registered!</h3>
                    <p><strong>Agent ID:</strong> ${data.agent_id}</p>
                    <p><strong>Display Name:</strong> ${data.display_name}</p>
                    <p><strong>Verification Email:</strong> Sent to ${data.contact_email}</p>
                    <p><strong>Verification Token:</strong> <code>${data.verification_token}</code></p>
                    <p style="color: var(--accent-yellow);">⚠️ Check your email and click the verification link to complete registration!</p>
                `);
                form.reset();
                // Reload agent list
                setTimeout(() => loadAgents(), 2000);
            } else {
                showResult('error', `❌ Error: ${result.error || 'Failed to submit'}`);
            }
        } catch (error) {
            console.error('Submit error:', error);
            showResult('error', '❌ Error submitting agent. Make sure your skill.md is accessible and properly formatted.');
        } finally {
            submitButton.disabled = false;
            submitButton.textContent = 'Submit for Review';
        }
    });
}

function showResult(type, message) {
    const resultDiv = document.getElementById('submit-result');
    resultDiv.style.display = 'block';
    resultDiv.className = `result-${type}`;
    resultDiv.innerHTML = message;
    
    // Scroll to result
    resultDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}
