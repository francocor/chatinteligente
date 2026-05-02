'use client';

import { Header } from '@/components/marketing/header';
import { Hero } from '@/components/marketing/hero';
import { ProblemSolution } from '@/components/marketing/problem-solution';
import { HowItWorks } from '@/components/marketing/how-it-works';
import { Benefits } from '@/components/marketing/benefits';
import { HybridChatbot } from '@/components/marketing/hybrid-chatbot';
import { HumanHandoff } from '@/components/marketing/human-handoff';
import { WhatsAppIntegration } from '@/components/marketing/whatsapp';
import { Analytics } from '@/components/marketing/analytics';
import { FeaturesGrid } from '@/components/marketing/features-grid';
import { Security } from '@/components/marketing/security-section';
import { Testimonials } from '@/components/marketing/testimonials';
import { Pricing } from '@/components/marketing/pricing';
import { CTA, Footer } from '@/components/marketing/footer';

export default function Home() {
  return (
    <main className="min-h-screen">
      <Header />
      <Hero />
      <ProblemSolution />
      <HowItWorks />
      <Benefits />
      <HybridChatbot />
      <HumanHandoff />
      <WhatsAppIntegration />
      <Analytics />
      <FeaturesGrid />
      <Security />
      <Testimonials />
      <Pricing />
      <CTA />
      <Footer />
    </main>
  );
}