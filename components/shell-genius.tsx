'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { parse } from 'marked';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { generateReverseShellFromEnvironment } from '@/ai/flows/generate-reverse-shell';
import { explainReverseShell, type ExplainReverseShellOutput } from '@/ai/flows/explain-reverse-shell';
import { generateDeliveryVectors, type GenerateDeliveryVectorsOutput } from '@/ai/flows/generate-delivery-vectors';
import { evadeDetection, type EvadeDetectionOutput } from '@/ai/flows/evade-detection';
import { CodeBlock } from './code-block';
import { templates } from '@/data/templates';
import { Terminal, VenetianMask, FileCode, Dna, Package, Info, ListTree, ShieldAlert, Signal, Laptop, AlertTriangle } from 'lucide-react';
import { RiskChart } from './risk-chart';

const formSchema = z.object({
  os: z.string().min(1, 'Operating system is required.'),
  architecture: z.string().min(1, 'Architecture is required.'),
  availableTools: z.string().min(1, 'Available tools are required.'),
  scriptingLanguage: z.string().min(1, 'Scripting language is required.'),
  targetIp: z.string().ip({ message: 'Invalid IP address.' }),
  targetPort: z.string().refine((val) => !isNaN(parseInt(val, 10)) && parseInt(val, 10) > 0 && parseInt(val, 10) < 65536, {
    message: 'Port must be a number between 1 and 65535.',
  }),
  encoding: z.string().min(1, "Encoding is required."),
});

type FormData = z.infer<typeof formSchema>;

const initialFormValues: FormData = {
  os: 'Linux',
  architecture: 'x64',
  availableTools: 'bash, /dev/tcp, nc',
  scriptingLanguage: 'bash',
  targetIp: '10.0.0.1',
  targetPort: '4444',
  encoding: 'none',
};

export function BreachCraft() {
  const { toast } = useToast();
  const [generatedScript, setGeneratedScript] = useState('');
  const [listenerScript, setListenerScript] = useState('');
  const [deliveryVectors, setDeliveryVectors] = useState<GenerateDeliveryVectorsOutput['vectors']>([]);
  const [explanation, setExplanation] = useState<ExplainReverseShellOutput | null>(null);
  const [evasionResult, setEvasionResult] = useState<EvadeDetectionOutput | null>(null);
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [isGeneratingDelivery, setIsGeneratingDelivery] = useState(false);
  const [isExplaining, setIsExplaining] = useState(false);
  const [isEvading, setIsEvading] = useState(false);

  const [lastUsedLanguage, setLastUsedLanguage] = useState('bash');
  const [activeTab, setActiveTab] = useState('payload');

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: initialFormValues,
  });

  useEffect(() => {
    try {
      const savedState = localStorage.getItem('breachcraft-form');
      if (savedState) {
        form.reset(JSON.parse(savedState));
      }
    } catch (error) {
      console.error("Failed to parse form state from localStorage", error);
    }
  }, [form]);

  useEffect(() => {
    const subscription = form.watch((value) => {
      try {
        localStorage.setItem('breachcraft-form', JSON.stringify(value));
      } catch (error) {
        console.error("Failed to save form state to localStorage", error);
      }
    });
    return () => subscription.unsubscribe();
  }, [form.watch]);
  
  const getDeliveryVectors = async (payloadScript: string, os: string) => {
    setIsGeneratingDelivery(true);
    setDeliveryVectors([]);
    try {
      const result = await generateDeliveryVectors({ payloadScript, os });
      setDeliveryVectors(result.vectors);
    } catch (error) {
      console.error(error);
      toast({
        variant: 'destructive',
        title: 'Error Generating Delivery Vectors',
        description: 'AI failed to generate delivery methods. Please try again.',
      });
    } finally {
      setIsGeneratingDelivery(false);
    }
  };

  const onSubmit = async (values: FormData) => {
    setIsGenerating(true);
    setGeneratedScript('');
    setListenerScript('');
    setExplanation(null);
    setDeliveryVectors([]);
    setEvasionResult(null);
    setActiveTab('payload');

    try {
      const result = await generateReverseShellFromEnvironment(values);
      setGeneratedScript(result.script);
      setListenerScript(result.listenerScript);
      setLastUsedLanguage(values.scriptingLanguage);
      await getDeliveryVectors(result.script, values.os);
    } catch (error)
 {
      console.error(error);
      toast({
        variant: 'destructive',
        title: 'Error Generating Script',
        description: 'An unexpected error occurred. Please try again.',
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleExplain = async () => {
    if (!generatedScript) return;
    setIsExplaining(true);
    setExplanation(null);
    try {
      const { targetIp, targetPort } = form.getValues();
      const result = await explainReverseShell({ reverseShellScript: generatedScript, targetIp, targetPort });
      setExplanation(result);
    } catch (error) {
      console.error(error);
      toast({
        variant: 'destructive',
        title: 'Error Explaining Script',
        description: 'An unexpected error occurred. Please try again.',
      });
    } finally {
      setIsExplaining(false);
    }
  };

  const handleEvade = async () => {
    if (!generatedScript || !lastUsedLanguage) return;
    setIsEvading(true);
    setEvasionResult(null);
    try {
      const result = await evadeDetection({ script: generatedScript, language: lastUsedLanguage });
      setEvasionResult(result);
    } catch (error) {
      console.error(error);
      toast({
        variant: 'destructive',
        title: 'Error Performing Evasion',
        description: 'An unexpected error occurred. Please try again.',
      });
    } finally {
      setIsEvading(false);
    }
  };

  const handleTemplateChange = (templateName: string) => {
    const template = templates.find(t => t.name === templateName);
    if (template) {
      const currentValues = form.getValues();
      form.reset({
        ...template.values,
        targetIp: currentValues.targetIp,
        targetPort: currentValues.targetPort,
        encoding: currentValues.encoding,
      });
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
      <Card>
        <CardHeader>
          <CardTitle>Generation Engine</CardTitle>
          <CardDescription>Configure the target environment to craft your payload.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="space-y-2">
              <Label>Load Template</Label>
              <Select onValueChange={handleTemplateChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a common payload template..." />
                </SelectTrigger>
                <SelectContent>
                  {templates.map(template => (
                    <SelectItem key={template.name} value={template.name}>
                      {template.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">
                  Or Configure Manually
                </span>
              </div>
            </div>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="os"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Operating System</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                          <FormControl>
                            <SelectTrigger><SelectValue placeholder="Select OS" /></SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Linux">Linux</SelectItem>
                            <SelectItem value="Windows">Windows</SelectItem>
                            <SelectItem value="macOS">macOS</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="architecture"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Architecture</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                          <FormControl>
                            <SelectTrigger><SelectValue placeholder="Select architecture" /></SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="x64">x64</SelectItem>
                            <SelectItem value="x86">x86</SelectItem>
                            <SelectItem value="ARM">ARM</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <FormField
                  control={form.control}
                  name="scriptingLanguage"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Scripting Language / Shell</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                        <FormControl>
                          <SelectTrigger><SelectValue placeholder="Select language" /></SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="bash">Bash</SelectItem>
                          <SelectItem value="python">Python</SelectItem>
                          <SelectItem value="powershell">PowerShell</SelectItem>
                           <SelectItem value="perl">Perl</SelectItem>
                          <SelectItem value="ruby">Ruby</SelectItem>
                          <SelectItem value="netcat">Netcat</SelectItem>
                           <SelectItem value="php">PHP</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="encoding"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Payload Encoding</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                        <FormControl>
                          <SelectTrigger><SelectValue placeholder="Select an encoding" /></SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="none">None</SelectItem>
                          <SelectItem value="base64">Base64</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormDescription>Encode the payload to help evade simple signature detection.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="availableTools"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Available Tools</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., bash, nc, python, /dev/tcp" {...field} />
                      </FormControl>
                      <FormDescription>Comma-separated list of tools on the target.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="targetIp"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Attacker IP</FormLabel>
                        <FormControl>
                          <Input placeholder="10.0.0.1" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="targetPort"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Attacker Port</FormLabel>
                        <FormControl>
                          <Input placeholder="4444" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <Button type="submit" disabled={isGenerating} className="w-full">
                  {isGenerating ? 'Crafting Payload...' : 'Craft Payload'}
                </Button>
              </form>
            </Form>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-8">
        <AnimatePresence>
          {isGenerating ? (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
              <Card>
                <CardHeader>
                  <Skeleton className="h-6 w-48" />
                  <Skeleton className="h-4 w-64 mt-2" />
                </CardHeader>
                <CardContent className="space-y-4">
                  <Skeleton className="h-32 w-full" />
                  <Skeleton className="h-8 w-1/2" />
                </CardContent>
              </Card>
            </motion.div>
          ) : generatedScript ? (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-5">
                    <TabsTrigger value="payload"><FileCode className="h-4 w-4 mr-2"/>Payload</TabsTrigger>
                    <TabsTrigger value="listener"><Terminal className="h-4 w-4 mr-2"/>Listener</TabsTrigger>
                    <TabsTrigger value="delivery"><Package className="h-4 w-4 mr-2"/>Delivery</TabsTrigger>
                    <TabsTrigger value="explanation"><Dna className="h-4 w-4 mr-2"/>Analysis</TabsTrigger>
                    <TabsTrigger value="evasion"><VenetianMask className="h-4 w-4 mr-2"/>Evasion</TabsTrigger>
                </TabsList>
                <Card className="rounded-t-none">
                    <CardContent className="p-0">
                        <TabsContent value="payload" className="p-6">
                            <CodeBlock code={generatedScript} language={lastUsedLanguage} />
                        </TabsContent>
                        <TabsContent value="listener" className="p-6">
                            <CodeBlock code={listenerScript} language="bash" />
                        </TabsContent>
                        <TabsContent value="delivery" className="p-6">
                            <AnimatePresence>
                                {isGeneratingDelivery ? (
                                    <div className="space-y-2">
                                        <Skeleton className="h-8 w-full" />
                                        <Skeleton className="h-8 w-full" />
                                    </div>
                                ) : deliveryVectors.length > 0 ? (
                                    <Accordion type="single" collapsible className="w-full">
                                    {deliveryVectors.map((vector, index) => (
                                        <AccordionItem value={`item-${index}`} key={index}>
                                        <AccordionTrigger>{vector.name}</AccordionTrigger>
                                        <AccordionContent>
                                            <CodeBlock code={vector.command} language="bash" />
                                        </AccordionContent>
                                        </AccordionItem>
                                    ))}
                                    </Accordion>
                                ) : (
                                    <p className="text-sm text-center py-8 text-muted-foreground">Could not generate delivery vectors.</p>
                                )}
                            </AnimatePresence>
                        </TabsContent>
                        <TabsContent value="explanation" className="p-6">
                             {explanation ? (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="space-y-6"
                                >
                                    <div>
                                        <h4 className="font-semibold mb-2 flex items-center"><Info className="h-4 w-4 mr-2 text-primary"/>Summary</h4>
                                        <p className="text-sm text-muted-foreground pl-6">{explanation.summary}</p>
                                    </div>

                                    <div>
                                        <h4 className="font-semibold mb-2 flex items-center"><ListTree className="h-4 w-4 mr-2 text-primary"/>Component Breakdown</h4>
                                        <Accordion type="single" collapsible className="w-full pl-6">
                                            {explanation.components.map((comp, index) => (
                                                <AccordionItem key={index} value={`comp-${index}`} className="border-border/50">
                                                    <AccordionTrigger className="text-sm">{comp.name}</AccordionTrigger>
                                                    <AccordionContent className="text-muted-foreground">{comp.description}</AccordionContent>
                                                </AccordionItem>
                                            ))}
                                        </Accordion>
                                    </div>
                                    
                                    <div>
                                        <h4 className="font-semibold mb-2 flex items-center"><ShieldAlert className="h-4 w-4 mr-2 text-primary"/>Indicators of Compromise (IOCs)</h4>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pl-6">
                                            <Card className="bg-card/50">
                                                <CardHeader className="p-4">
                                                    <CardTitle className="text-base flex items-center"><Signal className="h-4 w-4 mr-2"/>Network</CardTitle>
                                                </CardHeader>
                                                <CardContent className="p-4 pt-0">
                                                    <ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground">
                                                        {explanation.indicatorsOfCompromise.network.map((ioc, i) => <li key={i}>{ioc}</li>)}
                                                    </ul>
                                                </CardContent>
                                            </Card>
                                            <Card className="bg-card/50">
                                                <CardHeader className="p-4">
                                                    <CardTitle className="text-base flex items-center"><Laptop className="h-4 w-4 mr-2"/>Host</CardTitle>
                                                </CardHeader>
                                                <CardContent className="p-4 pt-0">
                                                    <ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground">
                                                        {explanation.indicatorsOfCompromise.host.map((ioc, i) => <li key={i}>{ioc}</li>)}
                                                    </ul>
                                                </CardContent>
                                            </Card>
                                        </div>
                                    </div>
                                    
                                    <div>
                                        <h4 className="font-semibold mb-2 flex items-center"><AlertTriangle className="h-4 w-4 mr-2 text-primary"/>Risk Analysis</h4>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center pl-6">
                                            <div>
                                                <p className="text-sm text-muted-foreground">{explanation.risk}</p>
                                            </div>
                                            <RiskChart score={explanation.riskScore} />
                                        </div>
                                    </div>
                                </motion.div>
                            ) : (
                                <div className="text-center py-8">
                                    <Button onClick={handleExplain} disabled={isExplaining} variant="outline">
                                        {isExplaining ? 'Analyzing...' : 'Run Analysis'}
                                    </Button>
                                    {isExplaining && (
                                        <div className="mt-4 space-y-4">
                                            <Skeleton className="h-24 w-full" />
                                            <Skeleton className="h-12 w-full" />
                                            <Skeleton className="h-12 w-full" />
                                        </div>
                                    )}
                                </div>
                            )}
                        </TabsContent>
                        <TabsContent value="evasion" className="p-6">
                            {evasionResult ? (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="space-y-6"
                                >
                                    <div>
                                        <h4 className="font-semibold mb-2">Evaded Payload</h4>
                                        <CodeBlock code={evasionResult.evadedScript} language={lastUsedLanguage} />
                                    </div>
                                    <div>
                                        <h4 className="font-semibold mb-2">Evasion Techniques</h4>
                                        <div 
                                            className="text-sm prose dark:prose-invert max-w-none prose-p:my-2 prose-ul:my-2 prose-li:my-0 break-words"
                                            dangerouslySetInnerHTML={{ __html: parse(evasionResult.explanation) }}
                                            />
                                    </div>
                                </motion.div>
                            ) : (
                                <div className="text-center py-8">
                                    <Button onClick={handleEvade} disabled={isEvading} variant="outline">
                                        {isEvading ? 'Applying Obfuscation...' : 'Attempt Evasion'}
                                    </Button>
                                    {isEvading && <Skeleton className="h-40 w-full mt-4" />}
                                </div>
                            )}
                        </TabsContent>
                    </CardContent>
                </Card>
                </Tabs>
            </motion.div>
          ) : (
             <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <Card>
                <CardHeader>
                    <CardTitle>Analysis &amp; Output</CardTitle>
                    <CardDescription>Your crafted payload and intelligence report will appear here.</CardDescription>
                </CardHeader>
                <CardContent className="text-center py-16 text-muted-foreground">
                    <Terminal className="h-12 w-12 mx-auto mb-4" />
                    <p>Configure and craft a payload to begin.</p>
                </CardContent>
                </Card>
             </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
