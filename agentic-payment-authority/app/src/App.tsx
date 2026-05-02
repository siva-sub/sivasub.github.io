import { useState } from 'react';
import {
  Container, Tabs, Paper, Stack, Group, Text, Title, Badge, Table,
  Accordion, RingProgress, SimpleGrid, Divider,
  ScrollArea,
} from '@mantine/core';
import {
  IconCreditCard, IconBuildingBank, IconCoin,
  IconArrowDown, IconCheck, IconAlertTriangle, IconBan,
  IconExternalLink, IconBook, IconShieldCheck,
  IconUser, IconBrandLinkedin,
} from '@tabler/icons-react';
import { LAYERS, RAILS, CLAIMS, SOURCES, type LayerKey } from './data';

const RAIL_KEYS = ['card', 'bank', 'stablecoin'] as const;

const RAIL_META: Record<string, { icon: React.ReactNode; color: string }> = {
  card: { icon: <IconCreditCard size={16} />, color: '#3B82F6' },
  bank: { icon: <IconBuildingBank size={16} />, color: '#22C55E' },
  stablecoin: { icon: <IconCoin size={16} />, color: '#F59E0B' },
};

function getRingColor(value: number): string {
  if (value >= 75) return 'var(--success)';
  if (value >= 50) return 'var(--warning)';
  return 'var(--error)';
}

function Hero() {
  return (
    <section className="hero-section">
      <Text
        size="xs"
        fw={700}
        tt="uppercase"
        style={{ letterSpacing: 2 }}
        c="var(--accent-warm)"
        mb="xs"
      >
        Learn with Siva
      </Text>
      <h1>
        Delegated Payment Authority
      </h1>
      <p className="hero-subtitle">
        How AI agents get scoped authority to make payments — across card token, bank, and stablecoin rails. 
        An interactive stack simulator built from Stripe SPT, Visa Intelligent Commerce, Mastercard Agent Pay, BIS CPMI, and BIS/FSB sources.
      </p>
    </section>
  );
}

function StackNode({
  layer,
  node,
  active,
  onClick,
}: {
  layer: (typeof LAYERS)[number];
  node: { title: string; body: string; sources: string[] };
  active: boolean;
  onClick: () => void;
}) {
  return (
    <div
      className={`stack-node ${active ? 'active' : ''}`}
      style={{ borderColor: active ? layer.border : undefined, background: active ? layer.bg : undefined }}
      onClick={onClick}
    >
      <div className="node-badge" style={{ background: layer.bg, color: layer.color, border: `1px solid ${layer.border}` }}>
        {layer.short}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div className="node-title" style={{ color: active ? layer.color : undefined }}>{layer.label}</div>
        <div className="node-sub">{node.title}</div>
      </div>
      {active && <IconArrowDown size={14} style={{ color: layer.color, flexShrink: 0 }} />}
    </div>
  );
}

function AuthorityStackSimulator() {
  const [activeRail, setActiveRail] = useState<string>('card');
  const [selectedLayer, setSelectedLayer] = useState<LayerKey>('mandate');

  return (
    <Paper className="brut-card" p="var(--space-5)" mb="var(--space-8)">
      <Stack gap="lg">
        <Group justify="space-between" align="flex-start" wrap="wrap">
          <div>
            <Title order={3} style={{ fontFamily: "'DM Sans',sans-serif", fontWeight: 800, fontSize: 20 }}>
              Authority Stack Simulator
            </Title>
            <Text size="sm" c="var(--ink-secondary)" mt={4}>
              Select a rail to see how the five authority layers map to that payment system.
            </Text>
          </div>
        </Group>

        <Tabs value={activeRail} onChange={(v) => { if (v) { setActiveRail(v); setSelectedLayer('mandate'); } }} variant="outline">
          <Tabs.List>
            {RAIL_KEYS.map((k) => (
              <Tabs.Tab
                key={k}
                value={k}
                leftSection={RAIL_META[k].icon}
                style={{ color: activeRail === k ? RAIL_META[k].color : undefined }}
              >
                {RAILS[k].name}
              </Tabs.Tab>
            ))}
          </Tabs.List>

          {RAIL_KEYS.map((k) => (
            <Tabs.Panel key={k} value={k} pt="md">
              <div className="fade-in">
                <Group align="flex-start" gap="xl" wrap="wrap">
                  <div style={{ flex: 1, minWidth: 280 }}>
                    <Stack gap="xs">
                      {LAYERS.map((layer, idx) => (
                        <div key={layer.key}>
                          <StackNode
                            layer={layer}
                            node={RAILS[k].layers[layer.key]}
                            active={selectedLayer === layer.key}
                            onClick={() => setSelectedLayer(layer.key)}
                          />
                          {idx < LAYERS.length - 1 && <div className="stack-arrow"><IconArrowDown size={14} /></div>}
                        </div>
                      ))}
                    </Stack>
                  </div>

                  <div style={{ flex: 1, minWidth: 280 }}>
                    <Paper className="detail-panel" withBorder={false}>
                      {(() => {
                        const layer = LAYERS.find((l) => l.key === selectedLayer)!;
                        const node = RAILS[k].layers[selectedLayer];
                        return (
                          <Stack gap="sm">
                            <Group gap="xs">
                              <Badge
                                size="sm"
                                style={{
                                  background: layer.bg,
                                  color: layer.color,
                                  border: `1px solid ${layer.border}`,
                                  textTransform: 'uppercase',
                                  fontFamily: "'JetBrains Mono',monospace",
                                  fontWeight: 700,
                                  fontSize: 10,
                                  letterSpacing: 1,
                                }}
                              >
                                {layer.label}
                              </Badge>
                              <Text size="xs" c="var(--ink-tertiary)">{node.title}</Text>
                            </Group>
                            <Divider color="var(--border-subtle)" />
                            <Text size="sm" c="var(--ink-secondary)" lh={1.6}>{node.body}</Text>
                            <Group gap="xs" mt="xs" wrap="wrap">
                              {node.sources.map((s) => (
                                <span key={s} className="source-pill">
                                  <IconBook size={10} /> {s}
                                </span>
                              ))}
                            </Group>
                          </Stack>
                        );
                      })()}
                    </Paper>
                  </div>
                </Group>
              </div>
            </Tabs.Panel>
          ))}
        </Tabs>
      </Stack>
    </Paper>
  );
}

function RailComparisonTable() {
  const dimensions = ['Credential Scoping', 'Post-payment Recourse', 'Settlement Programmability'];

  return (
    <Paper className="brut-card" p="var(--space-5)" mb="var(--space-8)">
      <Title order={3} mb="md" style={{ fontFamily: "'DM Sans',sans-serif", fontWeight: 800, fontSize: 20 }}>
        Rail Comparison
      </Title>

      <ScrollArea type="auto">
        <Table highlightOnHover withColumnBorders={false} withTableBorder={false}>
          <Table.Thead>
            <Table.Tr>
              <Table.Th style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 11, color: 'var(--ink-tertiary)', textTransform: 'uppercase', letterSpacing: 1 }}>Dimension</Table.Th>
              {RAIL_KEYS.map((k) => (
                <Table.Th key={k} style={{ fontFamily: "'DM Sans',sans-serif", fontWeight: 700, fontSize: 13 }}>
                  <Group gap="xs">
                    {RAIL_META[k].icon}
                    {RAILS[k].name}
                  </Group>
                </Table.Th>
              ))}
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {dimensions.map((dim) => (
              <Table.Tr key={dim}>
                <Table.Td style={{ fontWeight: 600, fontSize: 13 }}>{dim}</Table.Td>
                {RAIL_KEYS.map((k) => {
                  const value = RAILS[k].scores[dim];
                  return (
                    <Table.Td key={k}>
                      <div className="score-ring-wrap">
                        <RingProgress
                          size={52}
                          thickness={6}
                          roundCaps
                          sections={[{ value, color: getRingColor(value) }]}
                          label={
                            <Text size="10px" fw={700} ta="center">
                              {value}%
                            </Text>
                          }
                        />
                        <div>
                          <div className="score-sublabel">{RAILS[k].name}</div>
                        </div>
                      </div>
                    </Table.Td>
                  );
                })}
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
      </ScrollArea>
    </Paper>
  );
}

function ClaimBadge({ badge }: { badge: 'safe' | 'qualify' | 'do-not-say' }) {
  const config = {
    safe: { icon: <IconCheck size={12} />, label: 'Safe to say', cls: 'badge-safe' },
    qualify: { icon: <IconAlertTriangle size={12} />, label: 'Qualify', cls: 'badge-qualify' },
    'do-not-say': { icon: <IconBan size={12} />, label: 'Do not say', cls: 'badge-do-not-say' },
  }[badge];

  return (
    <Badge
      size="sm"
      className={config.cls}
      leftSection={config.icon}
      style={{ fontFamily: "'JetBrains Mono',monospace", fontWeight: 700, fontSize: 10, textTransform: 'uppercase', letterSpacing: 0.5 }}
    >
      {config.label}
    </Badge>
  );
}

function ClaimValidationPanel() {
  return (
    <Paper className="brut-card" p="var(--space-5)" mb="var(--space-8)">
      <Title order={3} mb="md" style={{ fontFamily: "'DM Sans',sans-serif", fontWeight: 800, fontSize: 20 }}>
        What the sources actually support
      </Title>
      <Text size="sm" c="var(--ink-secondary)" mb="md">
        Each claim below is rated against the primary sources. Click to expand the evidence.
      </Text>

      <Accordion variant="contained" chevronPosition="right">
        {CLAIMS.map((claim) => (
          <Accordion.Item key={claim.id} value={claim.id}>
            <Accordion.Control>
              <Group wrap="nowrap" gap="sm">
                <ClaimBadge badge={claim.badge} />
                <Text size="sm" fw={500} style={{ flex: 1, lineHeight: 1.4 }}>{claim.text}</Text>
              </Group>
            </Accordion.Control>
            <Accordion.Panel>
              <Stack gap="sm" py="xs">
                <Text size="sm" c="var(--ink-secondary)" lh={1.6}>{claim.evidence}</Text>
                <Group gap="xs" wrap="wrap">
                  {claim.source.split(', ').map((s) => (
                    <span key={s} className="source-pill">
                      <IconExternalLink size={10} /> {s}
                    </span>
                  ))}
                </Group>
              </Stack>
            </Accordion.Panel>
          </Accordion.Item>
        ))}
      </Accordion>
    </Paper>
  );
}

function SourceMap() {
  return (
    <Paper className="brut-card" p="var(--space-5)" mb="var(--space-8)">
      <Title order={3} mb="md" style={{ fontFamily: "'DM Sans',sans-serif", fontWeight: 800, fontSize: 20 }}>
        Source Map
      </Title>
      <Text size="sm" c="var(--ink-secondary)" mb="md">
        What each authoritative source actually supports, with direct citations.
      </Text>

      <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing="md">
        {SOURCES.map((src) => (
          <Paper key={src.name} className="source-card" withBorder={false}>
            <Stack gap="xs">
              <Group gap="xs" align="center">
                <IconShieldCheck size={16} style={{ color: 'var(--accent-warm)' }} />
                <h4 style={{ fontFamily: "'DM Sans',sans-serif", fontWeight: 700, fontSize: 14, margin: 0 }}>{src.name}</h4>
              </Group>
              <Text size="xs" c="var(--ink-tertiary)" style={{ fontFamily: "'JetBrains Mono',monospace" }}>{src.full}</Text>
              <Divider color="var(--border-subtle)" />
              <Text size="sm" c="var(--ink-primary)" fw={500} lh={1.5}>{src.supports}</Text>
              <Text size="xs" c="var(--ink-secondary)" lh={1.5}>{src.note}</Text>
            </Stack>
          </Paper>
        ))}
      </SimpleGrid>
    </Paper>
  );
}

function Footer() {
  return (
    <footer className="app-footer">
      <Stack gap="xs" align="center">
        <Group gap="xs" c="var(--ink-tertiary)">
          <IconUser size={14} />
          <Text size="sm">Built by Sivasubramanian R. — Product Owner, Payments & AI</Text>
        </Group>
        <Group gap="md">
          <a href="https://linkedin.com/in/sivasub987" target="_blank" rel="noreferrer">
            <IconBrandLinkedin size={16} /> LinkedIn
          </a>
          <a href="https://sivasub.com" target="_blank" rel="noreferrer">
            <IconExternalLink size={16} /> sivasub.com
          </a>
        </Group>
        <Text size="xs" c="var(--ink-muted)">
          Sources: Stripe SPT · Visa Intelligent Commerce · Mastercard Agent Pay · BIS CPMI · BIS/FSB · Google AP2
        </Text>
      </Stack>
    </footer>
  );
}

export default function App() {
  return (
    <Container size="lg" pt="var(--space-4)" pb="var(--space-8)">
      <Hero />
      <div className="main-grid">
        <div className="full-width">
          <AuthorityStackSimulator />
        </div>
        <div className="full-width">
          <RailComparisonTable />
        </div>
        <div className="full-width">
          <ClaimValidationPanel />
        </div>
        <div className="full-width">
          <SourceMap />
        </div>
      </div>
      <Footer />
    </Container>
  );
}
