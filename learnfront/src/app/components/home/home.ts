import { Component, OnInit, HostListener } from '@angular/core';

interface Subject {
  name: string;
  description: string;
  icon: string;
  color: string;
  questions: number;
  topics: number;
}

interface Testimonial {
  name: string;
  role: string;
  text: string;
  avatar: string;
}

@Component({
  selector: 'app-home',
  standalone: false,
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home implements OnInit {
  private subjects: Subject[] = [];
  private testimonials: Testimonial[] = [];
  private isScrolled = false;

  ngOnInit() {
    this.initializeSubjects();
    this.initializeTestimonials();
  }

  @HostListener('window:scroll')
  onScroll() {
    this.isScrolled = window.scrollY > 50;
  }

  private initializeSubjects() {
    this.subjects = [
      {
        name: 'Mathematics',
        description: 'Master algebra, geometry, calculus, and more with our comprehensive math curriculum.',
        icon: 'fas fa-calculator',
        color: 'linear-gradient(135deg, #667eea, #764ba2)',
        questions: 2500,
        topics: 45
      },
      {
        name: 'Science',
        description: 'Explore physics, chemistry, biology, and earth sciences through interactive learning.',
        icon: 'fas fa-flask',
        color: 'linear-gradient(135deg, #10b981, #059669)',
        questions: 1800,
        topics: 32
      },
      {
        name: 'English',
        description: 'Improve your language skills with grammar, vocabulary, and literature exercises.',
        icon: 'fas fa-book',
        color: 'linear-gradient(135deg, #f59e0b, #d97706)',
        questions: 1200,
        topics: 28
      },
      {
        name: 'Geography',
        description: 'Discover the world through geography, capitals, countries, and cultural studies.',
        icon: 'fas fa-globe',
        color: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
        questions: 900,
        topics: 22
      },
      {
        name: 'History',
        description: 'Journey through time with world history, ancient civilizations, and historical events.',
        icon: 'fas fa-landmark',
        color: 'linear-gradient(135deg, #8b5cf6, #7c3aed)',
        questions: 1100,
        topics: 25
      },
      {
        name: 'Computer Science',
        description: 'Learn programming, algorithms, and computer fundamentals from basics to advanced.',
        icon: 'fas fa-code',
        color: 'linear-gradient(135deg, #ef4444, #dc2626)',
        questions: 800,
        topics: 18
      }
    ];
  }

  private initializeTestimonials() {
    this.testimonials = [
      {
        name: 'Sarah Johnson',
        role: 'High School Student',
        text: 'LearnPlatform has completely transformed how I study. The AI-generated questions are so helpful and the progress tracking keeps me motivated!',
        avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face'
      },
      {
        name: 'Michael Chen',
        role: 'College Student',
        text: 'The personalized learning experience is incredible. I can focus on my weak areas and see real improvement in my grades.',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face'
      },
      {
        name: 'Emily Rodriguez',
        role: 'Teacher',
        text: 'As an educator, I love how this platform helps my students practice independently. The detailed analytics help me understand their progress.',
        avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face'
      },
      {
        name: 'David Thompson',
        role: 'Adult Learner',
        text: 'Learning new subjects as an adult seemed daunting, but this platform makes it engaging and achievable. Highly recommended!',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face'
      },
      {
        name: 'Lisa Wang',
        role: 'Parent',
        text: 'My kids love using LearnPlatform! They actually look forward to studying now, and I can see their confidence growing.',
        avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop&crop=face'
      },
      {
        name: 'James Wilson',
        role: 'Professional',
        text: 'I use this platform to keep my skills sharp and learn new topics for my career. The flexibility and quality are outstanding.',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face'
      }
    ];
  }

  // Public methods for template
  getSubjects(): Subject[] {
    return this.subjects;
  }

  getTestimonials(): Testimonial[] {
    return this.testimonials;
  }

  // Navigation methods
  scrollToFeatures() {
    const featuresSection = document.getElementById('features');
    if (featuresSection) {
      featuresSection.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
  }

  scrollToTop() {
    window.scrollTo({ 
      top: 0, 
      behavior: 'smooth' 
    });
  }

  // Utility methods
  getCurrentYear(): number {
    return new Date().getFullYear();
  }

  // Animation helpers
  isElementInViewport(element: HTMLElement): boolean {
    const rect = element.getBoundingClientRect();
    return (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
      rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
  }

  // Statistics methods (for dynamic content)
  getTotalUsers(): string {
    return '10,000+';
  }

  getTotalQuestions(): string {
    return '50,000+';
  }

  getSuccessRate(): string {
    return '95%';
  }

  // Feature highlights
  getFeatureHighlights() {
    return [
      {
        icon: 'fas fa-brain',
        title: 'AI-Powered',
        description: 'Advanced artificial intelligence generates personalized questions'
      },
      {
        icon: 'fas fa-chart-line',
        title: 'Progress Tracking',
        description: 'Real-time analytics and performance insights'
      },
      {
        icon: 'fas fa-gamepad',
        title: 'Gamified Learning',
        description: 'Achievements, streaks, and leaderboards keep you motivated'
      },
      {
        icon: 'fas fa-mobile-alt',
        title: 'Mobile Optimized',
        description: 'Learn anywhere, anytime on any device'
      }
    ];
  }

  // Social media links
  getSocialLinks() {
    return [
      { icon: 'fab fa-facebook', url: '#', label: 'Facebook' },
      { icon: 'fab fa-twitter', url: '#', label: 'Twitter' },
      { icon: 'fab fa-linkedin', url: '#', label: 'LinkedIn' },
      { icon: 'fab fa-instagram', url: '#', label: 'Instagram' }
    ];
  }

  // Footer links
  getFooterLinks() {
    return {
      platform: [
        { name: 'Features', url: '#features' },
        { name: 'Pricing', url: '#' },
        { name: 'How It Works', url: '#how-it-works' },
        { name: 'Subjects', url: '#subjects' }
      ],
      support: [
        { name: 'Help Center', url: '#' },
        { name: 'Contact Us', url: '#' },
        { name: 'FAQ', url: '#' },
        { name: 'Community', url: '#' }
      ],
      legal: [
        { name: 'Privacy Policy', url: '#' },
        { name: 'Terms of Service', url: '#' },
        { name: 'Cookie Policy', url: '#' },
        { name: 'GDPR', url: '#' }
      ]
    };
  }

  // Interactive methods
  onSubjectClick(subject: Subject) {
    console.log(`Clicked on ${subject.name}`);
    // This could navigate to subject-specific page or show more details
  }

  onTestimonialClick(testimonial: Testimonial) {
    console.log(`Clicked on testimonial from ${testimonial.name}`);
    // This could show full testimonial or navigate to user profile
  }

  onSocialLinkClick(platform: string) {
    console.log(`Clicked on ${platform} link`);
    // This would open the respective social media page
  }

  // Newsletter signup (placeholder)
  onNewsletterSignup(email: string) {
    console.log(`Newsletter signup for: ${email}`);
    // This would integrate with email service
  }

  // Demo request (placeholder)
  onRequestDemo() {
    console.log('Demo requested');
    // This would open a demo request modal or form
  }

  // Contact form (placeholder)
  onContactSubmit(formData: any) {
    console.log('Contact form submitted:', formData);
    // This would send contact form data to backend
  }

  // Utility method to format numbers
  formatNumber(num: number): string {
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  }

  // Method to get random testimonial
  getRandomTestimonial(): Testimonial {
    const randomIndex = Math.floor(Math.random() * this.testimonials.length);
    return this.testimonials[randomIndex];
  }

  // Method to get featured subjects (top 3)
  getFeaturedSubjects(): Subject[] {
    return this.subjects.slice(0, 3);
  }

  // Method to get subject by name
  getSubjectByName(name: string): Subject | undefined {
    return this.subjects.find(subject => subject.name === name);
  }

  // Method to get testimonials by role
  getTestimonialsByRole(role: string): Testimonial[] {
    return this.testimonials.filter(testimonial => 
      testimonial.role.toLowerCase().includes(role.toLowerCase())
    );
  }

  // Animation trigger methods
  triggerScrollAnimation() {
    const elements = document.querySelectorAll('.feature-card, .subject-card, .testimonial-card');
    elements.forEach(element => {
      if (this.isElementInViewport(element as HTMLElement)) {
        element.classList.add('animate-in');
      }
    });
  }

  // Method to handle smooth scrolling to any section
  scrollToSection(sectionId: string) {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
  }

  // Method to handle external link clicks
  openExternalLink(url: string) {
    window.open(url, '_blank', 'noopener,noreferrer');
  }

  // Method to copy link to clipboard
  copyToClipboard(text: string) {
    navigator.clipboard.writeText(text).then(() => {
      console.log('Link copied to clipboard');
      // Could show a toast notification here
    });
  }
}