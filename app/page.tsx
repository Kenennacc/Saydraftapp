'use client'
import { Button } from "@heroui/button";
import { Card, CardBody } from "@heroui/card";
import { Avatar } from "@heroui/avatar";
import { Chip } from "@heroui/chip";
import Link from "next/link";
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell } from "@heroui/table";
import { Accordion, AccordionItem } from "@heroui/accordion";
import { 
  ChevronDownIcon, 
  CheckIcon, 
  MicIcon,
  GlobeIcon,
  BrainIcon,
  ShieldCheckIcon,
  LockIcon,
  ScaleIcon,
  QuoteIcon,
  UsersIcon,
  BuildingIcon,
  BriefcaseIcon
} from "lucide-react";

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      {/* Header */}
      <header className="w-full px-6 py-4 flex items-center justify-between bg-background/80 backdrop-blur-sm border-b border-divider sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <img src="/logo.png" alt="SayDraft Logo" className="w-24 h-auto" />
        </div>
        
        <nav className="hidden md:flex items-center gap-8">
          <Link href="#features" className="text-foreground/70 hover:text-foreground">
            Features
          </Link>
          <Link href="#how-it-works" className="text-foreground/70 hover:text-foreground">
            How It Works
          </Link>
          <Link href="#pricing" className="text-foreground/70 hover:text-foreground">
            Pricing
          </Link>
        </nav>
        
        <div className="flex items-center gap-4">
          <Button as={Link} href="/auth/register" color="primary" className="bg-primary text-white">
            Start Free
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="w-full px-6 py-20 bg-background relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="max-w-6xl mx-auto text-center relative z-10">
          <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-6 leading-tight">
            The Future of Contracts Isn't Written —{" "}
            <span className="relative">
              It's Spoken
              <div className="absolute -bottom-2 left-0 right-0 h-3 bg-[#5940ff] opacity-30 rounded"></div>
            </span>
          </h1>
          
          <p className="text-xl text-foreground/70 mb-8 max-w-3xl mx-auto leading-relaxed">
            Create, negotiate, and sign contracts with your voice.
          </p>
          <p className="text-lg text-foreground/60 mb-12 max-w-2xl mx-auto">
            Speak naturally, in any language. Get AI-generated contracts instantly.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Button as={Link} href="/auth/register" size="lg" color="primary" className="bg-primary text-white px-8 py-6 text-lg">
              Start Free
            </Button>
          </div>
        </div>
      </section>

      {/* Why SayDraft Section */}
      <section id="features" className="w-full px-6 py-20 bg-background">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              Why SayDraft?
            </h2>
            <h3 className="text-2xl text-primary mb-8">Legal Contracts, Made Conversational</h3>
            <p className="text-xl text-foreground/70 max-w-4xl mx-auto">
              Tired of endless revisions, confusing legal jargon, and expensive lawyer fees? SayDraft lets anyone—anywhere—build contracts as easily as having a conversation.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="bg-background border border-divider">
              <CardBody className="p-8 text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <MicIcon className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-4">Voice-First</h3>
                <p className="text-foreground/70">Talk your contract into existence</p>
              </CardBody>
            </Card>

            <Card className="bg-background border border-divider">
              <CardBody className="p-8 text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <GlobeIcon className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-4">Multilingual</h3>
                <p className="text-foreground/70">Works in 100+ languages</p>
              </CardBody>
            </Card>

            <Card className="bg-background border border-divider">
              <CardBody className="p-8 text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <BrainIcon className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-4">Smart AI Mediation</h3>
                <p className="text-foreground/70">Say "I want 30 days" — it negotiates 22.</p>
              </CardBody>
            </Card>

            <Card className="bg-background border border-divider">
              <CardBody className="p-8 text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <ShieldCheckIcon className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-4">Secure Voice Signatures</h3>
                <p className="text-foreground/70">Approve with "I agree." It's legally binding.</p>
              </CardBody>
            </Card>

            <Card className="bg-background border border-divider">
              <CardBody className="p-8 text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <LockIcon className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-4">Encrypted Voice Records</h3>
                <p className="text-foreground/70">Proof of intent, stored for life.</p>
              </CardBody>
            </Card>

            <Card className="bg-background border border-divider">
              <CardBody className="p-8 text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <ScaleIcon className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-4">Legally Applicable</h3>
                <p className="text-foreground/70">The contract has full legal effect</p>
              </CardBody>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="w-full px-6 py-20 bg-background/50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-8">
              How It Works
            </h2>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="bg-background border border-divider">
              <CardBody className="p-8 text-center">
                <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-2xl font-bold text-white">1</span>
                </div>
                <h3 className="text-2xl font-bold text-foreground mb-4">Speak Your Terms</h3>
                <p className="text-foreground/70">
                  Just say what you need—like "Add a confidentiality clause and set payment to 30 days."
                </p>
              </CardBody>
            </Card>

            <Card className="bg-background border border-divider">
              <CardBody className="p-8 text-center">
                <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-2xl font-bold text-white">2</span>
                </div>
                <h3 className="text-2xl font-bold text-foreground mb-4">Let AI Do the Work</h3>
                <p className="text-foreground/70">
                  Our AI drafts a complete contract, checks legal validity, and even suggests fair compromises.
                </p>
              </CardBody>
            </Card>

            <Card className="bg-background border border-divider">
              <CardBody className="p-8 text-center">
                <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-2xl font-bold text-white">3</span>
                </div>
                <h3 className="text-2xl font-bold text-foreground mb-4">Seal It with Your Voice</h3>
                <p className="text-foreground/70">
                  Finalize with a spoken "I agree." No forms. No fuss. No fraud.
                </p>
              </CardBody>
            </Card>
          </div>
        </div>
      </section>

      {/* Built for Everyone Section */}
      <section className="w-full px-6 py-20 bg-background">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-8">
              Built for Everyone
            </h2>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="bg-background border border-divider">
              <CardBody className="p-8">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-6">
                  <BriefcaseIcon className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-2xl font-bold text-foreground mb-4">Freelancers & Startups</h3>
                <p className="text-foreground/70">
                  Create NDAs, service agreements, and contracts in minutes—zero legal background needed.
                </p>
              </CardBody>
            </Card>

            <Card className="bg-background border border-divider">
              <CardBody className="p-8">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-6">
                  <BuildingIcon className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-2xl font-bold text-foreground mb-4">SMBs & Remote Teams</h3>
                <p className="text-foreground/70">
                  Handle HR, vendor, and cross-border deals with multilingual voice support.
                </p>
              </CardBody>
            </Card>

            <Card className="bg-background border border-divider">
              <CardBody className="p-8">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-6">
                  <UsersIcon className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-2xl font-bold text-foreground mb-4">Enterprises & LegalTech</h3>
                <p className="text-foreground/70">
                  API-ready. Scalable. Compliant across jurisdictions. White-label our AI if needed.
                </p>
              </CardBody>
            </Card>
          </div>
        </div>
      </section>

      {/* Comparison Table Section */}
      <section className="w-full px-6 py-20 bg-background/50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-8">
              What Makes SayDraft Different?
            </h2>
          </div>
          
          <Card className="bg-background border border-divider">
            <CardBody className="p-0">
              <Table aria-label="Feature comparison table">
                <TableHeader>
                  <TableColumn>Feature</TableColumn>
                  <TableColumn>SayDraft</TableColumn>
                  <TableColumn>DocuSign</TableColumn>
                  <TableColumn>LegalZoom</TableColumn>
                </TableHeader>
                <TableBody>
                  <TableRow key="1">
                    <TableCell className="font-semibold">Voice-First Drafting</TableCell>
                    <TableCell><CheckIcon className="w-5 h-5 text-primary" /></TableCell>
                    <TableCell><span className="text-foreground/50">No</span></TableCell>
                    <TableCell><span className="text-foreground/50">No</span></TableCell>
                  </TableRow>
                  <TableRow key="2">
                    <TableCell className="font-semibold">AI-Powered Negotiation</TableCell>
                    <TableCell><CheckIcon className="w-5 h-5 text-primary" /></TableCell>
                    <TableCell><span className="text-foreground/50">No</span></TableCell>
                    <TableCell><span className="text-foreground/50">No</span></TableCell>
                  </TableRow>
                  <TableRow key="3">
                    <TableCell className="font-semibold">Multilingual Support</TableCell>
                    <TableCell>100+ Languages</TableCell>
                    <TableCell><span className="text-foreground/50">Limited</span></TableCell>
                    <TableCell><span className="text-foreground/50">Limited</span></TableCell>
                  </TableRow>
                  <TableRow key="4">
                    <TableCell className="font-semibold">Voice Authentication</TableCell>
                    <TableCell><CheckIcon className="w-5 h-5 text-primary" /></TableCell>
                    <TableCell><span className="text-foreground/50">No</span></TableCell>
                    <TableCell><span className="text-foreground/50">No</span></TableCell>
                  </TableRow>
                  <TableRow key="5">
                    <TableCell className="font-semibold">Encrypted Voice Record Storage</TableCell>
                    <TableCell><CheckIcon className="w-5 h-5 text-primary" /></TableCell>
                    <TableCell><span className="text-foreground/50">No</span></TableCell>
                    <TableCell><span className="text-foreground/50">No</span></TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardBody>
          </Card>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="w-full px-6 py-20 bg-background">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-8">
              Loved by Early Users
            </h2>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            <Card className="bg-background border border-divider">
              <CardBody className="p-8">
                <QuoteIcon className="w-8 h-8 text-primary mb-4" />
                <blockquote className="text-lg text-foreground italic mb-6">
                  "It feels like talking to a lawyer… without paying one."
                </blockquote>
                <div className="flex items-center gap-3">
                  <Avatar src="https://i.pravatar.cc/150?img=11" className="w-10 h-10" />
                  <div>
                    <div className="font-semibold text-foreground">Daniel P. Baddeley Jr.</div>
                    <div className="text-foreground/70">Early Power User</div>
                  </div>
                </div>
              </CardBody>
            </Card>

            <Card className="bg-background border border-divider">
              <CardBody className="p-8">
                <QuoteIcon className="w-8 h-8 text-primary mb-4" />
                <blockquote className="text-lg text-foreground italic mb-6">
                  "I created a vendor contract while walking. That's next-level."
                </blockquote>
                <div className="flex items-center gap-3">
                  <Avatar src="https://i.pravatar.cc/150?img=12" className="w-10 h-10" />
                  <div>
                    <div className="font-semibold text-foreground">Ops Lead</div>
                    <div className="text-foreground/70">Remote-first eCom Brand</div>
                  </div>
                </div>
              </CardBody>
            </Card>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="w-full px-6 py-20 bg-primary">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-8">
            Ready to Speak Your Next Contract Into Existence?
          </h2>
          <p className="text-xl text-white/80 mb-8">
            Start Free Today – SayDraft is your AI-powered legal voice.
          </p>
          
          <Button as={Link} href="/auth/register" size="lg" className="bg-white text-primary px-8 py-6 text-lg">
            Create Your First Contract
          </Button>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="w-full px-6 py-20 bg-background">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-8">
              FAQs
            </h2>
          </div>
          
          <Accordion variant="splitted" className="px-0">
            <AccordionItem key="1" aria-label="Is it legally valid?" title="Is it legally valid?">
              Yes—SayDraft ensures all core contract elements (offer, acceptance, consideration) are covered, with secure biometric signatures.
            </AccordionItem>
            <AccordionItem key="2" aria-label="Do I need to know law?" title="Do I need to know law?">
              Nope. Just speak normally—our AI translates your intent into enforceable terms.
            </AccordionItem>
            <AccordionItem key="3" aria-label="Is it secure?" title="Is it secure?">
              Absolutely. We use AES-256 encryption and tamper-proof voice records.
            </AccordionItem>
          </Accordion>
        </div>
      </section>

      {/* Trust Section */}
      <section className="w-full px-6 py-12 bg-background/50">
        <div className="max-w-4xl mx-auto text-center">
          <h3 className="text-2xl font-bold text-foreground mb-4">
            Built With Trust
          </h3>
          <p className="text-lg text-foreground/70">
            Used by 10,000+ early adopters. Backed by legal experts. Designed for the global economy.
          </p>
        </div>
      </section>
    </main>
  );
}
