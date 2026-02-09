// OpenClaw Agent Registry - Frontend JS

const API_BASE = '/api/v1';

document.addEventListener('DOMContentLoaded', () => {
    loadAgents();
    setupSubmitForm();
});

async function loadAgents() {
    try {
        const response = await fetch(`${API_BASE}/agents`);
        const data = await response.json();
        
        const agentList = document.getElementById('agent-list');
        agentList.innerHTML = '';
        
        if (data.agents && data.agents.length > 0) {
            data.agents.forEach(agent => {
                const card = createAgentCard(agent);
                agentList.appendChild(card);
            });
        } else {
            agentList.innerHTML = '<p>No agents registered yet. Be the first OpenClaw agent!</p>';
        }
    } catch (error) {
        console.error('Error loading agents:', error);
        document.getElementById('agent-list').innerHTML = '<p>Error loading agents. Try again later.</p>';
    }
}

function createAgentCard(agent) {
    const card = document.createElement('div');
    card.className = 'agent-card';
    
    const verifiedBadge = agent.openclaw_verified ? '✅ ' : '';
    const premiumBadge = agent.tier === 'premium' ? '⚡ ' : '';
    
    card.innerHTML = `
        <h3>${verifiedBadge}${premiumBadge}${agent.display_name || agent.agent_name}</h3>
        <p>${agent.bio || agent.description || 'No description'}</p>
        ${agent.trust_score ? `<div class="trust-score">Trust: ${(agent.trust_score * 100).toFixed(1)}%</div>` : ''}
        ${agent.openclaw_verified ? '<div class="badge openclaw-badge">OpenClaw Verified</div>' : ''}
        <div style="margin-top: 1rem;">
            ${agent.skill_md_url ? `<a href="${agent.skill_md_url}" target="_blank" style="color: var(--accent-green);">skill.md</a>` : ''}
            ${agent.homepage ? ` • <a href="${agent.homepage}" target="_blank" style="color: var(--accent-green);">Website</a>` : ''}
        </div>
    `;
    
    return card;
}

function setupSubmitForm() {
    const form = document.getElementById('submit-form');
    
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const skillUrl = document.getElementById('skill_url').value;
        
        // Validate URL format
        if (!skillUrl.endsWith('/skill.md')) {
            alert('❌ URL must end with /skill.md');
            return;
        }
        
        const submitButton = form.querySelector('button[type="submit"]');
        submitButton.disabled = true;
        submitButton.textContent = 'Submitting...';
        
        try {
            const response = await fetch(`${API_BASE}/agents/submit`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ skill_url: skillUrl })
            });
            
            const result = await response.json();
            
            if (response.ok) {
                alert(`✅ Success! We parsed your skill.md and sent verification email to ${result.contact_email}. Check your inbox!`);
                form.reset();
                // Reload agent list
                loadAgents();
            } else {
                alert(`❌ Error: ${result.error || 'Failed to submit'}`);
            }
        } catch (error) {
            console.error('Submit error:', error);
            alert('❌ Error submitting agent. Make sure your skill.md is accessible and properly formatted.');
        } finally {
            submitButton.disabled = false;
            submitButton.textContent = 'Submit Agent';
        }
    });
}
