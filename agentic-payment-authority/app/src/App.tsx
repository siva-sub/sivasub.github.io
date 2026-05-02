import { useState } from 'react';
import {
  Container, Tabs, Paper, Stack, Group, Text, Badge, Table,
  RingProgress, SimpleGrid, Divider, Transition, Title, Tooltip,
  Box,
} from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import {
  IconCreditCard, IconBuildingBank, IconCoin,
  IconArrowDown, IconBook, IconShieldCheck,
  IconUser, IconBrandLinkedin, IconExternalLink,
  IconSchool, IconWorldWww,
} from '@tabler/icons-react';
import {
  LAYERS, RAILS, SOURCES, LEARN_STEPS, type LayerKey, SOURCE_URLS,
} from './data';

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

function getShortRailName(key: string): string {
  if (key === 'card') return 'Card';
  if (key === 'bank') return 'Bank';
  return 'Stablecoin';
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
    <Tooltip label={layer.description} withArrow multiline w={240}>
      <div
        className={`stack-node ${active ? 'active' : ''}`}
        style={{
          borderColor: active ? layer.border : undefined,
          background: active ? layer.bg : undefined,
          transition: 'all 0.25s cubic-bezier(0.25, 0.1, 0.25, 1)',
        }}
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
    </Tooltip>
  );
}

function FlowVisualizer({ activeLayer }: { activeLayer: LayerKey }) {
  return (
    <div className="flow-viz">
      {LAYERS.map((layer, idx) => {
        const isActive = layer.key === activeLayer;
        return (
          <Tooltip key={layer.key} label={layer.description} withArrow multiline w={220}>
            <div
              className={`flow-viz-block ${isActive ? 'active' : ''}`}
              style={{
                background: isActive ? layer.bg : 'var(--surface-1)',
                borderColor: isActive ? layer.border : 'var(--border-subtle)',
                color: isActive ? layer.color : 'var(--ink-tertiary)',
                transition: 'all 0.3s cubic-bezier(0.25, 1, 0.5, 1)',
                animationDelay: `${idx * 60}ms`,
              }}
            >
              <span className="flow-viz-letter">{layer.short}</span>
              <span className="flow-viz-label">{layer.label}</span>
              {isActive && (
                <div style={{
                  width: '60%',
                  height: 2,
                  borderRadius: 1,
                  background: layer.color,
                  marginTop: 4,
                  transition: 'width 0.3s cubic-bezier(0.25, 1, 0.5, 1)',
                }} />
              )}
            </div>
          </Tooltip>
        );
      })}
    </div>
  );
}

function AuthorityStackSimulator() {
  const isMobile = useMediaQuery('(max-width: 768px)');
  const [activeRail, setActiveRail] = useState<string>('card');
  const [selectedLayer, setSelectedLayer] = useState<LayerKey>('mandate');
  const activeIdx = LAYERS.findIndex((l) => l.key === selectedLayer) + 1;

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
          {activeIdx > 0 && (
            <Text size="xs" fw={600} c="var(--ink-tertiary)" style={{ fontFamily: "'JetBrains Mono',monospace" }}>
              Step {activeIdx} of 5
            </Text>
          )}
        </Group>

        <Tabs value={activeRail} onChange={(v) => { if (v) { setActiveRail(v); setSelectedLayer('mandate'); } }} variant="outline">
          <Tabs.List>
            {RAIL_KEYS.map((k) => (
              <Tabs.Tab
                key={k}
                value={k}
                leftSection={RAIL_META[k].icon}
                style={{
                  color: activeRail === k ? RAIL_META[k].color : undefined,
                  transition: 'color 0.2s ease',
                }}
              >
                {isMobile ? getShortRailName(k) : RAILS[k].name}
              </Tabs.Tab>
            ))}
          </Tabs.List>

          {RAIL_KEYS.map((k) => (
            <Tabs.Panel key={k} value={k} pt="md">
              <div className="fade-in">
                <Group align="flex-start" gap="xl" wrap="wrap" className="sim-layout">
                  <div style={{ flex: 1, minWidth: isMobile ? '100%' : 280 }}>
                    <Stack gap="xs">
                      <FlowVisualizer activeLayer={selectedLayer} />
                      <Stack gap="xs" mt="md">
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
                    </Stack>
                  </div>

                  <div style={{ flex: 1, minWidth: isMobile ? '100%' : 280 }}>
                    <Transition
                      key={`${k}-${selectedLayer}`}
                      mounted={true}
                      transition="slide-up"
                      duration={300}
                    >
                      {(styles) => (
                        <Paper className="detail-panel" withBorder={false} style={styles}>
                          {(() => {
                            const layer = LAYERS.find((l) => l.key === selectedLayer)!;
                            const node = RAILS[k].layers[selectedLayer];
                            return (
                              <Stack gap="sm">
                                <Group gap="xs" justify="space-between">
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
                                  <Text size="xs" fw={600} c="var(--ink-tertiary)" style={{ fontFamily: "'JetBrains Mono',monospace" }}>
                                    {activeIdx}/5
                                  </Text>
                                </Group>
                                <Divider color="var(--border-subtle)" />
                                <Text size="sm" c="var(--ink-secondary)" lh={1.6}>{node.body}</Text>
                                <Group gap="xs" mt="xs" wrap="wrap">
                                  {node.sources.map((s) => {
                                    const url = SOURCE_URLS[s];
                                    if (url) {
                                      return (
                                        <a
                                          key={s}
                                          href={url}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          className="source-pill source-pill-link"
                                        >
                                          <IconBook size={10} /> {s} <IconExternalLink size={10} />
                                        </a>
                                      );
                                    }
                                    return (
                                      <span key={s} className="source-pill">
                                        <IconBook size={10} /> {s}
                                      </span>
                                    );
                                  })}
                                </Group>
                              </Stack>
                            );
                          })()}
                        </Paper>
                      )}
                    </Transition>
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
  const isMobile = useMediaQuery('(max-width: 768px)');
  const dimensions = ['Credential Scoping', 'Post-payment Recourse', 'Settlement Programmability'];

  return (
    <Paper className="brut-card" p="var(--space-5)" mb="var(--space-8)">
      <Title order={3} mb="md" style={{ fontFamily: "'DM Sans',sans-serif", fontWeight: 800, fontSize: 20 }}>
        Rail Comparison
      </Title>

      <Box style={{ overflowX: 'auto' }}>
        <Table highlightOnHover withColumnBorders={false} withTableBorder={false}>
          <Table.Thead>
            <Table.Tr>
              <Table.Th style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 11, color: 'var(--ink-tertiary)', textTransform: 'uppercase', letterSpacing: 1 }}>Dimension</Table.Th>
              {RAIL_KEYS.map((k) => (
                <Table.Th key={k} style={{ fontFamily: "'DM Sans',sans-serif", fontWeight: 700, fontSize: 13 }}>
                  <Group gap="xs">
                    {RAIL_META[k].icon}
                    {isMobile ? getShortRailName(k) : RAILS[k].name}
                  </Group>
                </Table.Th>
              ))}
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {dimensions.map((dim) => (
              <Table.Tr key={dim}>
                <Table.Td style={{ fontWeight: 600, fontSize: 13, whiteSpace: 'nowrap' }}>{dim}</Table.Td>
                {RAIL_KEYS.map((k) => {
                  const value = RAILS[k].scores[dim];
                  return (
                    <Table.Td key={k}>
                      <div className="score-ring-wrap">
                        <RingProgress
                          size={isMobile ? 44 : 52}
                          thickness={isMobile ? 5 : 6}
                          roundCaps
                          sections={[{ value, color: getRingColor(value) }]}
                          label={
                            <Text size="10px" fw={700} ta="center">
                              {value}%
                            </Text>
                          }
                        />
                        {!isMobile && (
                          <div>
                            <div className="score-sublabel">{getShortRailName(k)}</div>
                          </div>
                        )}
                      </div>
                    </Table.Td>
                  );
                })}
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
      </Box>
    </Paper>
  );
}

function SourceMap() {
  return (
    <Paper className="brut-card" p="var(--space-5)" mb="var(--space-8)">
      <Title order={3} mb="md" style={{ fontFamily: "'DM Sans',sans-serif", fontWeight: 800, fontSize: 20 }}>
        Authoritative Sources
      </Title>

      <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing="md">
        {SOURCES.map((src) => (
          <a
            key={src.name}
            href={src.url}
            target="_blank"
            rel="noopener noreferrer"
            className="source-card-link"
          >
            <Paper className="source-card" withBorder={false}>
              <Stack gap="xs">
                <Group gap="xs" align="center">
                  <IconShieldCheck size={16} style={{ color: 'var(--accent-warm)' }} />
                  <h4 style={{ fontFamily: "'DM Sans',sans-serif", fontWeight: 700, fontSize: 14, margin: 0 }}>{src.name}</h4>
                </Group>
                <Text size="xs" c="var(--ink-tertiary)" style={{ fontFamily: "'JetBrains Mono',monospace" }}>{src.full}</Text>
                <Divider color="var(--border-subtle)" />
                <Text size="sm" c="var(--ink-primary)" fw={500} lh={1.5}>{src.supports}</Text>
                <Text size="xs" c="var(--ink-secondary)" lh={1.5}>{src.note}</Text>
                <Group gap="xs" mt={4}>
                  <IconWorldWww size={12} style={{ color: 'var(--accent-warm)' }} />
                  <Text size="xs" c="var(--accent-warm)" fw={600} style={{ textDecoration: 'underline' }}>Visit source</Text>
                </Group>
              </Stack>
            </Paper>
          </a>
        ))}
      </SimpleGrid>
    </Paper>
  );
}

function LearnPanel() {
  const [activeIdx, setActiveIdx] = useState(0);
  const activeLayer = LAYERS[activeIdx];
  const step = LEARN_STEPS[activeIdx];

  return (
    <Paper className="brut-card" p="var(--space-5)" mb="var(--space-8)">
      <Group gap="xs" mb="lg">
        <IconSchool size={20} style={{ color: 'var(--accent-warm)' }} />
        <Title order={3} style={{ fontFamily: "'DM Sans',sans-serif", fontWeight: 800, fontSize: 20 }}>
          Learn the Authority Stack
        </Title>
      </Group>
      <Text size="sm" c="var(--ink-secondary)" mb="lg">
        Walk through the five layers of delegated payment authority — from intent to recovery.
      </Text>

      <div className="learn-steps-wrap">
        {LEARN_STEPS.map((s, i) => {
          const l = LAYERS.find((layer) => layer.key === s.layer)!;
          const isActive = i === activeIdx;
          return (
            <div key={s.layer} className="learn-step-row">
              <div
                className={`learn-step-circle ${isActive ? 'active' : ''}`}
                style={{
                  borderColor: isActive ? l.border : 'var(--border-standard)',
                  background: isActive ? l.bg : 'var(--surface-0)',
                  color: isActive ? l.color : 'var(--ink-tertiary)',
                  cursor: 'pointer',
                }}
                onClick={() => setActiveIdx(i)}
              >
                <span style={{ fontFamily: "'JetBrains Mono',monospace", fontWeight: 700, fontSize: 14 }}>
                  {l.short}
                </span>
              </div>
              {i < LEARN_STEPS.length - 1 && (
                <div className="learn-step-connector" style={{ borderColor: i < activeIdx ? l.border : 'var(--border-subtle)' }} />
              )}
            </div>
          );
        })}
      </div>

      <div className="learn-progress" style={{ marginTop: 12, marginBottom: 24 }}>
        <Text size="xs" fw={600} c="var(--ink-tertiary)" ta="center" style={{ fontFamily: "'JetBrains Mono',monospace" }}>
          Step {activeIdx + 1} of 5
        </Text>
        <div className="progress-track">
          <div
            className="progress-fill"
            style={{
              width: `${((activeIdx + 1) / 5) * 100}%`,
              background: activeLayer.color,
            }}
          />
        </div>
      </div>

      <Transition mounted={true} transition="fade" duration={250} key={activeIdx}>
        {(styles) => (
          <Paper
            withBorder
            p="lg"
            style={{
              ...styles,
              borderColor: activeLayer.border,
              background: activeLayer.bg,
              borderRadius: 'var(--radius-lg)',
            }}
          >
            <Stack gap="sm">
              <Group gap="xs">
                <Badge
                  size="sm"
                  style={{
                    background: activeLayer.bg,
                    color: activeLayer.color,
                    border: `1px solid ${activeLayer.border}`,
                    textTransform: 'uppercase',
                    fontFamily: "'JetBrains Mono',monospace",
                    fontWeight: 700,
                    fontSize: 10,
                    letterSpacing: 1,
                  }}
                >
                  {activeLayer.label}
                </Badge>
                <Text size="sm" fw={700} style={{ fontFamily: "'DM Sans',sans-serif", color: 'var(--ink-primary)' }}>
                  {step.title}
                </Text>
              </Group>
              <Divider color="var(--border-standard)" />
              <Text size="sm" c="var(--ink-secondary)" lh={1.7}>
                {step.body}
              </Text>
              <Group gap="xs" mt="xs" wrap="wrap">
                {step.sources.map((s) => {
                  const url = SOURCE_URLS[s];
                  if (url) {
                    return (
                      <a key={s} href={url} target="_blank" rel="noopener noreferrer" className="source-pill source-pill-link">
                        <IconBook size={10} /> {s} <IconExternalLink size={10} />
                      </a>
                    );
                  }
                  return (
                    <span key={s} className="source-pill">
                      <IconBook size={10} /> {s}
                    </span>
                  );
                })}
              </Group>
            </Stack>
          </Paper>
        )}
      </Transition>

      <Group justify="center" mt="lg" gap="md">
        <button
          className="step-nav-btn"
          disabled={activeIdx === 0}
          onClick={() => setActiveIdx((i) => Math.max(0, i - 1))}
        >
          ← Prev
        </button>
        <button
          className="step-nav-btn primary"
          disabled={activeIdx === LEARN_STEPS.length - 1}
          onClick={() => setActiveIdx((i) => Math.min(LEARN_STEPS.length - 1, i + 1))}
        >
          Next →
        </button>
      </Group>
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
          Sources: Stripe SPT · Visa Intelligent Commerce · BIS CPMI · FSB · Google Pay
        </Text>
      </Stack>
    </footer>
  );
}

export default function App() {
  const [activeTab, setActiveTab] = useState<string | null>('simulator');
  const isMobile = useMediaQuery('(max-width: 768px)');

  return (
    <Container size="lg" pt="var(--space-4)" pb="var(--space-8)">
      <Hero />
      <Tabs value={activeTab} onChange={setActiveTab} mb="var(--space-8)">
        <Tabs.List>
          <Tabs.Tab
            value="simulator"
            leftSection={<IconCreditCard size={16} />}
          >
            {isMobile ? 'Simulator' : 'Stack Simulator'}
          </Tabs.Tab>
          <Tabs.Tab
            value="learn"
            leftSection={<IconSchool size={16} />}
          >
            {isMobile ? 'Learn' : 'Learn'}
          </Tabs.Tab>
          <Tabs.Tab
            value="compare"
            leftSection={<IconBuildingBank size={16} />}
          >
            {isMobile ? 'Compare' : 'Rail Comparison'}
          </Tabs.Tab>
          <Tabs.Tab
            value="sources"
            leftSection={<IconShieldCheck size={16} />}
          >
            {isMobile ? 'Sources' : 'Sources'}
          </Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="simulator" pt="md">
          <div className="main-grid">
            <div className="full-width">
              <AuthorityStackSimulator />
            </div>
          </div>
        </Tabs.Panel>

        <Tabs.Panel value="learn" pt="md">
          <div className="main-grid">
            <div className="full-width">
              <LearnPanel />
            </div>
          </div>
        </Tabs.Panel>

        <Tabs.Panel value="compare" pt="md">
          <div className="main-grid">
            <div className="full-width">
              <RailComparisonTable />
            </div>
          </div>
        </Tabs.Panel>

        <Tabs.Panel value="sources" pt="md">
          <div className="main-grid">
            <div className="full-width">
              <SourceMap />
            </div>
          </div>
        </Tabs.Panel>
      </Tabs>

      <div className="main-grid">
        {/* These are already inside tabs but rendered if needed; keeping as full-width for tab panels instead */}
      </div>
      <Footer />
    </Container>
  );
}
