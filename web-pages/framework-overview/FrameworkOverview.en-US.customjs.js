// Framework Overview page custom JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Add smooth scrolling for framework step navigation
    const stepCards = document.querySelectorAll('.step-card');
    
    stepCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px)';
            this.style.boxShadow = '0 8px 25px rgba(0,0,0,0.15)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
        });
    });

    // Progress indicator for framework steps
    const steps = document.querySelectorAll('.step-number');
    steps.forEach((step, index) => {
        step.addEventListener('click', function() {
            // Highlight current step and previous steps
            steps.forEach((s, i) => {
                if (i <= index) {
                    s.classList.add('completed');
                } else {
                    s.classList.remove('completed');
                }
            });
        });
    });

    // Add CSS for interactive elements
    const style = document.createElement('style');
    style.textContent = `
        .step-card {
            transition: all 0.3s ease;
            cursor: pointer;
            margin-bottom: 2rem;
            padding: 1.5rem;
            border-radius: 8px;
            border: 1px solid #e0e0e0;
            background: #fff;
        }
        
        .step-header {
            display: flex;
            align-items: center;
            margin-bottom: 1rem;
        }
        
        .step-number {
            width: 40px;
            height: 40px;
            border-radius: 50%;
            background: #007bff;
            color: white;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: bold;
            margin-right: 1rem;
            transition: all 0.3s ease;
        }
        
        .step-number.completed {
            background: #28a745;
        }
        
        .step-content ul {
            margin-bottom: 1rem;
        }
        
        .card {
            padding: 1.5rem;
            border: 1px solid #e0e0e0;
            border-radius: 8px;
            height: 100%;
            transition: all 0.3s ease;
        }
        
        .card:hover {
            transform: translateY(-3px);
            box-shadow: 0 4px 15px rgba(0,0,0,0.1);
        }
        
        .framework-intro {
            background: #f8f9fa;
            padding: 2rem;
            border-radius: 8px;
            margin-bottom: 2rem;
        }
        
        .alert-info {
            background: #e3f2fd;
            border: 1px solid #90caf9;
            padding: 1.5rem;
            border-radius: 8px;
        }
    `;
    document.head.appendChild(style);
});