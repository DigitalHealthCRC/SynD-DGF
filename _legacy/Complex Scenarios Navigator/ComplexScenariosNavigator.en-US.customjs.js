// Complex Scenarios Navigator page custom JavaScript
document.addEventListener('DOMContentLoaded', function() {
    let pathwayHistory = [];
    let currentNode = 'start-node';
    
    // Initialize decision tree functionality
    initializeDecisionTree();
    
    function initializeDecisionTree() {
        const optionButtons = document.querySelectorAll('.option-btn');
        optionButtons.forEach(button => {
            button.addEventListener('click', function() {
                const targetNode = this.getAttribute('data-target');
                navigateToNode(targetNode);
                recordPathwayStep(this.textContent, targetNode);
                updatePathwaySummary();
            });
        });
    }
    
    function navigateToNode(nodeId) {
        // Hide current node
        const currentNodeElement = document.querySelector('.decision-node.active');
        if (currentNodeElement) {
            currentNodeElement.classList.remove('active');
        }
        
        // Show target node
        const targetNodeElement = document.getElementById(nodeId);
        if (targetNodeElement) {
            targetNodeElement.classList.add('active');
            currentNode = nodeId;
            
            // Smooth scroll to new node
            targetNodeElement.scrollIntoView({ 
                behavior: 'smooth', 
                block: 'center' 
            });
        }
    }
    
    function recordPathwayStep(choice, nodeId) {
        pathwayHistory.push({
            choice: choice,
            nodeId: nodeId,
            timestamp: new Date()
        });
    }
    
    function updatePathwaySummary() {
        const resultsContainer = document.getElementById('pathway-results');
        
        if (pathwayHistory.length === 0) {
            resultsContainer.innerHTML = '<p>Complete the decision tree above to receive personalised guidance for your complex scenario.</p>';
            return;
        }
        
        let summaryHTML = '<h3>Your pathway:</h3><div class="pathway-steps">';
        
        pathwayHistory.forEach((step, index) => {
            summaryHTML += `
                <div class="pathway-step">
                    <div class="step-number">${index + 1}</div>
                    <div class="step-content">
                        <strong>${step.choice}</strong>
                        ${getStepGuidance(step.nodeId)}
                    </div>
                </div>
            `;
        });
        
        summaryHTML += '</div>';
        
        // Add final recommendations
        summaryHTML += getFinalRecommendations();
        
        resultsContainer.innerHTML = summaryHTML;
    }
    
    function getStepGuidance(nodeId) {
        const guidance = {
            'multi-org': '<p>Multiple organisations require enhanced governance and legal frameworks.</p>',
            'linkage-required': '<p>Data linkage adds significant complexity and regulatory requirements.</p>',
            'third-party': '<p>Third-party involvement requires enhanced security and contractual protections.</p>',
            'cloud-provider': '<p>Cloud processing requires Australian hosting and enhanced security measures.</p>',
            'high-risk': '<p>Higher risks require project pause and additional safeguards.</p>',
            'special-pop': '<p>Special populations require enhanced consultation and cultural protocols.</p>',
            'indigenous-pathway': '<p>Indigenous data requires comprehensive community engagement and governance.</p>',
            'international': '<p>International sharing requires careful legal analysis and enhanced protections.</p>'
        };
        
        return guidance[nodeId] || '';
    }
    
    function getFinalRecommendations() {
        const finalNode = pathwayHistory[pathwayHistory.length - 1]?.nodeId;
        
        const recommendations = {
            'linkage-required': `
                <div class="final-recommendations">
                    <h4>Required next steps:</h4>
                    <ul>
                        <li>Engage legal experts specialising in health data linkage</li>
                        <li>Contact relevant data linkage authorities in your jurisdiction</li>
                        <li>Develop comprehensive data governance framework</li>
                        <li>Establish independent oversight committee</li>
                        <li>Complete enhanced privacy impact assessment</li>
                    </ul>
                    <div class="timeline-estimate">
                        <strong>Estimated timeline:</strong> 6-12 months for approval and implementation
                    </div>
                </div>
            `,
            'cloud-provider': `
                <div class="final-recommendations">
                    <h4>Required next steps:</h4>
                    <ul>
                        <li>Complete government cloud security assessment framework</li>
                        <li>Negotiate comprehensive data processing agreement</li>
                        <li>Implement enhanced monitoring and audit procedures</li>
                        <li>Establish incident response protocols</li>
                        <li>Obtain additional insurance coverage</li>
                    </ul>
                    <div class="timeline-estimate">
                        <strong>Estimated timeline:</strong> 3-6 months for implementation
                    </div>
                </div>
            `,
            'indigenous-pathway': `
                <div class="final-recommendations">
                    <h4>Required next steps:</h4>
                    <ul>
                        <li>Initiate community consultation with relevant ACCHOs</li>
                        <li>Engage Indigenous data governance experts</li>
                        <li>Submit to Indigenous-specific ethics committee</li>
                        <li>Develop community benefit sharing agreement</li>
                        <li>Establish ongoing community engagement protocols</li>
                    </ul>
                    <div class="timeline-estimate">
                        <strong>Estimated timeline:</strong> 9-18 months for full consultation and approval
                    </div>
                </div>
            `
        };
        
        return recommendations[finalNode] || `
            <div class="final-recommendations">
                <h4>Next steps:</h4>
                <p>Based on your pathway, you should:</p>
                <ul>
                    <li>Review the additional requirements identified</li>
                    <li>Consult with relevant legal and technical experts</li>
                    <li>Develop enhanced governance and oversight procedures</li>
                    <li>Complete additional assessments as required</li>
                </ul>
            </div>
        `;
    }
    
    // Complexity card interactions
    const complexityCards = document.querySelectorAll('.complexity-card');
    complexityCards.forEach(card => {
        card.addEventListener('click', function() {
            this.classList.toggle('selected');
        });
    });
    
    // Back navigation functionality
    function addBackNavigation() {
        const backButton = document.createElement('button');
        backButton.className = 'back-button';
        backButton.textContent = '← Back';
        backButton.addEventListener('click', goBack);
        
        document.querySelector('.tree-container').prepend(backButton);
    }
    
    function goBack() {
        if (pathwayHistory.length > 0) {
            pathwayHistory.pop();
            
            if (pathwayHistory.length === 0) {
                navigateToNode('start-node');
            } else {
                const previousStep = pathwayHistory[pathwayHistory.length - 1];
                navigateToNode(previousStep.nodeId);
            }
            
            updatePathwaySummary();
        }
    }
    
    // Reset functionality
    function addResetButton() {
        const resetButton = document.createElement('button');
        resetButton.className = 'reset-button';
        resetButton.textContent = '🔄 Reset';
        resetButton.addEventListener('click', resetDecisionTree);
        
        document.querySelector('.pathway-summary h2').after(resetButton);
    }
    
    function resetDecisionTree() {
        pathwayHistory = [];
        currentNode = 'start-node';
        
        // Hide all nodes except start
        document.querySelectorAll('.decision-node').forEach(node => {
            node.classList.remove('active');
        });
        
        document.getElementById('start-node').classList.add('active');
        updatePathwaySummary();
        
        // Scroll to start
        document.getElementById('start-node').scrollIntoView({ 
            behavior: 'smooth', 
            block: 'center' 
        });
    }
    
    // Initialize additional controls
    addBackNavigation();
    addResetButton();
    
    // Add CSS for interactive elements
    const style = document.createElement('style');
    style.textContent = `
        .navigator-intro {
            background: #f8f9fa;
            padding: 2rem;
            border-radius: 8px;
            margin-bottom: 2rem;
        }
        
        .complexity-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 1.5rem;
            margin: 1.5rem 0;
        }
        
        .complexity-card {
            background: white;
            border: 1px solid #e0e0e0;
            border-radius: 8px;
            padding: 1.5rem;
            cursor: pointer;
            transition: all 0.3s ease;
        }
        
        .complexity-card:hover {
            transform: translateY(-3px);
            box-shadow: 0 4px 15px rgba(0,0,0,0.1);
        }
        
        .complexity-card.selected {
            border-color: #007bff;
            background: #e3f2fd;
            transform: translateY(-5px);
        }
        
        .complexity-card h3 {
            color: #007bff;
            margin-bottom: 1rem;
        }
        
        .tree-container {
            position: relative;
            margin: 2rem 0;
            min-height: 400px;
        }
        
        .decision-node {
            display: none;
            background: white;
            border: 1px solid #e0e0e0;
            border-radius: 8px;
            padding: 2rem;
            margin: 1rem 0;
            position: relative;
        }
        
        .decision-node.active {
            display: block;
            animation: fadeInSlide 0.5s ease-in-out;
        }
        
        @keyframes fadeInSlide {
            from {
                opacity: 0;
                transform: translateY(20px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        .node-content h3 {
            color: #007bff;
            margin-bottom: 1rem;
            border-bottom: 2px solid #e0e0e0;
            padding-bottom: 0.5rem;
        }
        
        .scenario-details, .risk-assessment, .critical-requirements,
        .cloud-requirements, .risk-mitigation, .special-considerations,
        .indigenous-requirements, .international-requirements {
            background: #f8f9fa;
            padding: 1.5rem;
            border-radius: 6px;
            margin: 1.5rem 0;
        }
        
        .critical-requirements {
            background: #fff3cd;
            border-left: 4px solid #ffc107;
        }
        
        .critical-requirements h4 {
            color: #d68910;
        }
        
        .risk-mitigation {
            background: #ffebee;
            border-left: 4px solid #f44336;
        }
        
        .risk-mitigation h4 {
            color: #d32f2f;
        }
        
        .cloud-requirements {
            background: #e3f2fd;
            border-left: 4px solid #2196f3;
        }
        
        .special-considerations {
            background: #f3e5f5;
            border-left: 4px solid #9c27b0;
        }
        
        .indigenous-requirements {
            background: #e8f5e8;
            border-left: 4px solid #4caf50;
        }
        
        .international-requirements {
            background: #fff3e0;
            border-left: 4px solid #ff9800;
        }
        
        .recommendations {
            background: #e8f5e8;
            padding: 1.5rem;
            border-radius: 6px;
            margin: 1.5rem 0;
            border-left: 4px solid #4caf50;
        }
        
        .pathway-completion {
            background: #e8f5e8;
            padding: 1rem;
            border-radius: 6px;
            text-align: center;
            margin-top: 1.5rem;
        }
        
        .node-options {
            margin-top: 2rem;
            display: flex;
            flex-direction: column;
            gap: 1rem;
        }
        
        .option-btn {
            background: #007bff;
            color: white;
            border: none;
            padding: 1rem 1.5rem;
            border-radius: 6px;
            cursor: pointer;
            transition: all 0.3s ease;
            text-align: left;
            font-size: 1rem;
        }
        
        .option-btn:hover {
            background: #0056b3;
            transform: translateX(5px);
        }
        
        .back-button, .reset-button {
            background: #6c757d;
            color: white;
            border: none;
            padding: 0.75rem 1.5rem;
            border-radius: 6px;
            cursor: pointer;
            margin: 1rem 0;
            transition: background 0.3s ease;
        }
        
        .back-button:hover, .reset-button:hover {
            background: #545b62;
        }
        
        .reset-button {
            float: right;
            background: #dc3545;
        }
        
        .reset-button:hover {
            background: #c82333;
        }
        
        .pathway-results {
            background: #f8f9fa;
            padding: 2rem;
            border-radius: 8px;
            margin: 2rem 0;
        }
        
        .pathway-steps {
            margin: 1.5rem 0;
        }
        
        .pathway-step {
            display: flex;
            margin-bottom: 1.5rem;
            align-items: flex-start;
            gap: 1rem;
        }
        
        .step-number {
            background: #007bff;
            color: white;
            width: 30px;
            height: 30px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: bold;
            flex-shrink: 0;
        }
        
        .step-content {
            flex: 1;
            background: white;
            padding: 1rem;
            border-radius: 6px;
            border-left: 4px solid #007bff;
        }
        
        .final-recommendations {
            background: #e8f5e8;
            padding: 1.5rem;
            border-radius: 8px;
            margin-top: 2rem;
            border-left: 4px solid #4caf50;
        }
        
        .final-recommendations h4 {
            color: #2e7d32;
            margin-bottom: 1rem;
        }
        
        .timeline-estimate {
            background: #fff3cd;
            padding: 1rem;
            border-radius: 6px;
            margin-top: 1rem;
            border-left: 4px solid #ffc107;
        }
        
        .resource-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 1.5rem;
            margin: 2rem 0;
        }
        
        .resource-card {
            background: white;
            border: 1px solid #e0e0e0;
            border-radius: 8px;
            padding: 1.5rem;
            text-align: center;
            transition: all 0.3s ease;
        }
        
        .resource-card:hover {
            transform: translateY(-3px);
            box-shadow: 0 4px 15px rgba(0,0,0,0.1);
        }
        
        .resource-card h3 {
            color: #007bff;
            margin-bottom: 1rem;
        }
        
        .breadcrumb {
            padding: 0.75rem 0;
            margin-bottom: 1rem;
            font-size: 0.9rem;
        }
        
        .breadcrumb a {
            color: #007bff;
            text-decoration: none;
        }
        
        .breadcrumb a:hover {
            text-decoration: underline;
        }
        
        .navigation-links {
            margin-top: 3rem;
            padding-top: 2rem;
            border-top: 1px solid #e0e0e0;
        }
        
        .nav-buttons {
            display: flex;
            justify-content: space-between;
        }
        
        .nav-button {
            padding: 0.75rem 1.5rem;
            background: #007bff;
            color: white;
            text-decoration: none;
            border-radius: 6px;
            transition: background 0.3s ease;
        }
        
        .nav-button:hover {
            background: #0056b3;
            text-decoration: none;
            color: white;
        }
        
        @media (max-width: 768px) {
            .complexity-grid {
                grid-template-columns: 1fr;
            }
            
            .resource-grid {
                grid-template-columns: 1fr;
            }
            
            .nav-buttons {
                flex-direction: column;
                gap: 1rem;
            }
            
            .pathway-step {
                flex-direction: column;
                align-items: center;
                text-align: center;
            }
        }
    `;
    document.head.appendChild(style);
});