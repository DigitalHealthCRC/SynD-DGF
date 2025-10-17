/**
 * Animated Sloth Avatar Component
 * Lightweight eye-tracking sloth face without heavy dependencies
 */

class SlothAvatar {
  constructor(container) {
    this.container = container;
    this.leftEye = null;
    this.rightEye = null;
    this.boundUpdateEyes = this.updateEyes.bind(this);

    this.render();
    this.attachListeners();
  }

  render() {
    this.container.innerHTML = `
      <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" class="sloth-avatar">
        <!-- Sloth Head (rounded) -->
        <ellipse cx="50" cy="52" rx="42" ry="42" fill="#9B8B6F" />

        <!-- Eye patches and muzzle area -->
        <ellipse cx="37" cy="50" rx="15" ry="12" fill="#6B5B4F" />
        <ellipse cx="63" cy="50" rx="15" ry="12" fill="#6B5B4F" />

        <!-- Muzzle arc connecting the eyes -->
        <path d="M 28 55 Q 50 65 72 55" fill="#6B5B4F" />

        <!-- Nose -->
        <ellipse cx="50" cy="61" rx="3" ry="2.5" fill="#000" />

        <!-- Smile -->
        <path d="M 42 67 Q 50 72 58 67" fill="none" stroke="#000" stroke-width="1.5" stroke-linecap="round" />

        <!-- Left Eye White -->
        <circle cx="37" cy="50" r="7.5" fill="#FFF" class="eye-white" />

        <!-- Right Eye White -->
        <circle cx="63" cy="50" r="7.5" fill="#FFF" class="eye-white" />

        <!-- Left Pupil (will move) -->
        <g class="left-pupil" data-eye="left">
          <circle cx="37" cy="50" r="4" fill="#000" />
        </g>

        <!-- Right Pupil (will move) -->
        <g class="right-pupil" data-eye="right">
          <circle cx="63" cy="50" r="4" fill="#000" />
        </g>
      </svg>
    `;

    this.leftEye = this.container.querySelector('.left-pupil');
    this.rightEye = this.container.querySelector('.right-pupil');
  }

  attachListeners() {
    // Update eye position on mouse move
    document.addEventListener('mousemove', this.boundUpdateEyes);
  }

  updateEyes(event) {
    if (!this.leftEye || !this.rightEye) return;

    const svg = this.container.querySelector('svg');
    const rect = svg.getBoundingClientRect();

    // Mouse position relative to SVG
    const mouseX = ((event.clientX - rect.left) / rect.width) * 100;
    const mouseY = ((event.clientY - rect.top) / rect.height) * 100;

    // Update left eye
    this.updatePupil(this.leftEye, 37, 50, mouseX, mouseY);

    // Update right eye
    this.updatePupil(this.rightEye, 63, 50, mouseX, mouseY);
  }

  updatePupil(pupilElement, eyeCenterX, eyeCenterY, mouseX, mouseY) {
    // Calculate angle and distance from eye center to mouse
    const dx = mouseX - eyeCenterX;
    const dy = mouseY - eyeCenterY;
    const angle = Math.atan2(dy, dx);

    // Maximum pupil movement (radius of eye white minus pupil radius)
    const maxDistance = 3.5;

    // Calculate new pupil position (constrained within eye)
    const distance = Math.min(maxDistance, Math.sqrt(dx * dx + dy * dy));
    const pupilX = eyeCenterX + Math.cos(angle) * distance;
    const pupilY = eyeCenterY + Math.sin(angle) * distance;

    // Update pupil position
    const circle = pupilElement.querySelector('circle');
    circle.setAttribute('cx', pupilX);
    circle.setAttribute('cy', pupilY);
  }

  destroy() {
    document.removeEventListener('mousemove', this.boundUpdateEyes);
  }
}

// Export for use in chatbot
window.SlothAvatar = SlothAvatar;
