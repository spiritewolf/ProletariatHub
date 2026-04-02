import {
  Avatar,
  Box,
  Button,
  Field,
  Flex,
  Heading,
  Input,
  SimpleGrid,
  Stack,
  Text,
  Wrap,
  WrapItem,
} from '@chakra-ui/react';
import { type FormEvent, useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import {
  hubPatchBodySchema,
  hubPatchResponseSchema,
  setupComradeBodySchema,
  setupComradesListResponseSchema,
  setupCompleteResponseSchema,
  setupCreateComradeResponseSchema,
  type SetupComradeRow,
} from '@proletariat-hub/contracts';
import { apiJsonValidated } from '../api';
import { useAuth } from '../auth/AuthContext';
import {
  AuthenticationWizard,
  FlowCard,
  FlowStepLabel,
} from '../components/flow/AuthenticationWizard';
import { flowPalette } from '../flow-theme';

export function SetupWizardPage() {
  const { authenticatedComrade, refreshAuthenticatedComrade } = useAuth();
  const [step, setStep] = useState<2 | 3 | 4>(2);
  const [hubName, setHubName] = useState(authenticatedComrade?.hubName ?? 'My Hub');
  const [hubSaved, setHubSaved] = useState(false);
  const [recruits, setRecruits] = useState<SetupComradeRow[]>([]);
  const [recruitUsername, setRecruitUsername] = useState('');
  const [recruitPhone, setRecruitPhone] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  useEffect(() => {
    if (!authenticatedComrade?.hubName) {
      return;
    }
    setHubName((h) =>
      h === 'My Hub' && authenticatedComrade.hubName !== 'My Hub'
        ? authenticatedComrade.hubName
        : h,
    );
  }, [authenticatedComrade?.hubName]);

  async function loadRecruits() {
    const data = await apiJsonValidated('/api/setup/comrades', setupComradesListResponseSchema);
    setRecruits(data.comrades);
  }

  useEffect(() => {
    if (step !== 3 && step !== 4) {
      return;
    }
    if (!authenticatedComrade?.isAdmin) {
      return;
    }
    let cancelled = false;
    void (async () => {
      try {
        const data = await apiJsonValidated('/api/setup/comrades', setupComradesListResponseSchema);
        if (!cancelled) {
          setRecruits(data.comrades);
        }
      } catch {
        /* ignore */
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [step, authenticatedComrade?.isAdmin]);

  if (!authenticatedComrade) {
    return <Navigate to="/login" replace />;
  }
  if (!authenticatedComrade.isAdmin) {
    return <Navigate to="/" replace />;
  }
  if (authenticatedComrade.mustChangePassword) {
    return <Navigate to="/change-password" replace />;
  }
  if (authenticatedComrade.hasCompletedSetup) {
    return <Navigate to="/" replace />;
  }

  const headerSubtitle =
    hubSaved || step >= 3 ? `${authenticatedComrade.hubName} ♥` : 'the household collective';

  async function saveHub(e: FormEvent) {
    e.preventDefault();
    setError(null);
    const parsed = hubPatchBodySchema.safeParse({ name: hubName.trim() });
    if (!parsed.success) {
      const first = parsed.error.issues[0];
      setError(first?.message ?? 'Invalid hub name');
      return;
    }
    setPending(true);
    try {
      await apiJsonValidated('/api/setup/hub', hubPatchResponseSchema, {
        method: 'PATCH',
        json: parsed.data,
      });
      await refreshAuthenticatedComrade();
      setHubSaved(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed');
    } finally {
      setPending(false);
    }
  }

  async function addRecruit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    const phoneTrimmed = recruitPhone.trim();
    const parsed = setupComradeBodySchema.safeParse({
      username: recruitUsername.trim(),
      notificationPhone: phoneTrimmed.length > 0 ? phoneTrimmed : undefined,
    });
    if (!parsed.success) {
      const first = parsed.error.issues[0];
      setError(first?.message ?? 'Invalid input');
      return;
    }
    setPending(true);
    try {
      await apiJsonValidated('/api/setup/comrades', setupCreateComradeResponseSchema, {
        method: 'POST',
        json: parsed.data,
      });
      setRecruitUsername('');
      setRecruitPhone('');
      await loadRecruits();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed');
    } finally {
      setPending(false);
    }
  }

  async function finish() {
    setError(null);
    setPending(true);
    try {
      await apiJsonValidated('/api/setup/complete', setupCompleteResponseSchema, {
        method: 'POST',
      });
      await refreshAuthenticatedComrade();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed');
    } finally {
      setPending(false);
    }
  }

  function comradeInitial(name: string) {
    return name.slice(0, 1).toUpperCase();
  }

  return (
    <AuthenticationWizard subtitle={headerSubtitle} progressFill={step}>
      {step === 2 && !hubSaved ? (
        <FlowCard>
          <FlowStepLabel step={2} />
          <Heading as="h2" size="xl" mb={3} color={flowPalette.text}>
            Name your Hub
          </Heading>
          <Text color={flowPalette.muted} mb={6} fontSize="sm" lineHeight="tall">
            What shall the collective be called? This name greets every Comrade when they log in.
          </Text>
          <form onSubmit={saveHub}>
            <Stack gap={5}>
              <Field.Root>
                <Field.Label color={flowPalette.text}>Hub name</Field.Label>
                <Input
                  value={hubName}
                  onChange={(e) => setHubName(e.target.value)}
                  required
                  borderColor={flowPalette.border}
                  _focusVisible={{
                    borderColor: flowPalette.maroon,
                    boxShadow: `0 0 0 1px ${flowPalette.maroon}`,
                  }}
                />
              </Field.Root>
              {error ? (
                <Text color={flowPalette.error} fontSize="sm">
                  {error}
                </Text>
              ) : null}
              <Button
                type="submit"
                loading={pending}
                bg={flowPalette.maroon}
                color={flowPalette.pageBg}
                _hover={{ bg: flowPalette.maroonDark }}
                size="lg"
                width="full"
              >
                {pending ? 'Saving…' : 'Onward, Comrade →'}
              </Button>
            </Stack>
          </form>
        </FlowCard>
      ) : null}

      {step === 2 && hubSaved ? (
        <FlowCard>
          <FlowStepLabel step={2} />
          <Heading as="h2" size="xl" mb={3} color={flowPalette.text}>
            Name your Hub
          </Heading>
          <Box
            borderRadius="lg"
            bg={flowPalette.pageBg}
            borderWidth="1px"
            borderColor={flowPalette.border}
            p={4}
            mb={4}
            fontSize="sm"
            color={flowPalette.text}
          >
            The people of <strong>{authenticatedComrade.hubName}</strong> will see this name on
            their login screen. You can update it anytime in Settings.
          </Box>
          <Text fontSize="xs" fontWeight="bold" color={flowPalette.maroon} mb={4}>
            ★ Hub created
          </Text>
          <Stack gap={3}>
            <Button
              type="button"
              bg={flowPalette.maroon}
              color={flowPalette.pageBg}
              _hover={{ bg: flowPalette.maroonDark }}
              size="lg"
              width="full"
              onClick={() => setStep(3)}
            >
              Onward, Comrade →
            </Button>
            <Button
              type="button"
              variant="ghost"
              color={flowPalette.muted}
              onClick={() => setHubSaved(false)}
            >
              Edit name
            </Button>
          </Stack>
        </FlowCard>
      ) : null}

      {step === 3 ? (
        <FlowCard>
          <FlowStepLabel step={3} />
          <Heading as="h2" size="xl" mb={3} color={flowPalette.text}>
            Recruit your Comrades
          </Heading>
          <Text color={flowPalette.muted} mb={6} fontSize="sm" lineHeight="tall">
            Add your household. They&apos;ll get the default password and be asked to change it on
            first login.
          </Text>
          <Stack as="ul" gap={3} listStyleType="none" mb={6} pl={0}>
            {recruits.map((c) => (
              <Flex
                as="li"
                key={c.id}
                align="center"
                gap={3}
                py={2}
                borderBottomWidth="1px"
                borderColor={flowPalette.border}
              >
                <Avatar.Root size="sm" bg={flowPalette.maroon} color={flowPalette.pageBg}>
                  <Avatar.Fallback>{comradeInitial(c.username)}</Avatar.Fallback>
                </Avatar.Root>
                <Box>
                  <Text fontWeight="medium" color={flowPalette.text}>
                    {c.username}
                  </Text>
                  <Text fontSize="xs" color={flowPalette.muted}>
                    Comrade ★
                  </Text>
                  {c.notificationPhone ? (
                    <Text fontSize="xs" color={flowPalette.muted} mt={1}>
                      {c.notificationPhone}
                    </Text>
                  ) : null}
                </Box>
              </Flex>
            ))}
          </Stack>
          <Box
            borderRadius="xl"
            borderWidth="2px"
            borderStyle="dashed"
            borderColor={flowPalette.border}
            p={5}
            mb={4}
          >
            <Text fontWeight="semibold" color={flowPalette.maroon} mb={4}>
              + New Comrade
            </Text>
            <form onSubmit={addRecruit}>
              <Stack gap={4}>
                <Field.Root>
                  <Field.Label color={flowPalette.text}>Username</Field.Label>
                  <Input
                    value={recruitUsername}
                    onChange={(e) => setRecruitUsername(e.target.value)}
                    placeholder="john"
                    required
                    borderColor={flowPalette.border}
                    _focusVisible={{
                      borderColor: flowPalette.maroon,
                      boxShadow: `0 0 0 1px ${flowPalette.maroon}`,
                    }}
                  />
                </Field.Root>
                <Field.Root>
                  <Field.Label color={flowPalette.text}>Phone (optional)</Field.Label>
                  <Input
                    type="tel"
                    value={recruitPhone}
                    onChange={(e) => setRecruitPhone(e.target.value)}
                    placeholder="+1 555…"
                    autoComplete="tel"
                    borderColor={flowPalette.border}
                    _focusVisible={{
                      borderColor: flowPalette.maroon,
                      boxShadow: `0 0 0 1px ${flowPalette.maroon}`,
                    }}
                  />
                </Field.Root>
                {error ? (
                  <Text color={flowPalette.error} fontSize="sm">
                    {error}
                  </Text>
                ) : null}
                <Button
                  type="submit"
                  loading={pending}
                  bg={flowPalette.maroonSoft}
                  color="white"
                  _hover={{ bg: flowPalette.maroon }}
                  width="full"
                >
                  {pending ? '…' : 'Enlist ★'}
                </Button>
              </Stack>
            </form>
          </Box>
          <Stack gap={2}>
            <Button
              type="button"
              variant="outline"
              borderColor={flowPalette.border}
              onClick={() => setStep(4)}
            >
              Skip for now
            </Button>
            <Button
              type="button"
              variant="ghost"
              color={flowPalette.muted}
              onClick={() => setStep(2)}
            >
              Back
            </Button>
          </Stack>
        </FlowCard>
      ) : null}

      {step === 4 ? (
        <FlowCard>
          <Text fontSize="4xl" textAlign="center" color={flowPalette.maroon} aria-hidden mb={2}>
            ★
          </Text>
          <Heading as="h2" size="xl" mb={3} color={flowPalette.text} textAlign="center">
            The collective is assembled!
          </Heading>
          <Text color={flowPalette.muted} mb={6} fontSize="sm" lineHeight="tall" textAlign="center">
            Your Hub is live. Comrades will be prompted to change their password on first login —
            the revolution starts with good opsec.
          </Text>
          <SimpleGrid columns={{ base: 1, sm: 2 }} gap={4} mb={6}>
            <Box
              borderRadius="lg"
              bg={flowPalette.pageBg}
              p={4}
              borderWidth="1px"
              borderColor={flowPalette.border}
            >
              <Text
                fontSize="xs"
                fontWeight="bold"
                color={flowPalette.maroon}
                letterSpacing="0.08em"
              >
                ★ HUB
              </Text>
              <Text fontWeight="semibold" color={flowPalette.text} mt={2}>
                {authenticatedComrade.hubName}
              </Text>
            </Box>
            <Box
              borderRadius="lg"
              bg={flowPalette.pageBg}
              p={4}
              borderWidth="1px"
              borderColor={flowPalette.border}
            >
              <Text
                fontSize="xs"
                fontWeight="bold"
                color={flowPalette.maroon}
                letterSpacing="0.08em"
              >
                ★ COMRADES ENLISTED
              </Text>
              <Wrap mt={3} gap={2}>
                {recruits.map((c) => (
                  <WrapItem key={c.id}>
                    <Box
                      as="span"
                      px={2}
                      py={1}
                      borderRadius="md"
                      bg="white"
                      borderWidth="1px"
                      borderColor={flowPalette.border}
                      fontSize="sm"
                    >
                      {c.username}
                    </Box>
                  </WrapItem>
                ))}
              </Wrap>
            </Box>
          </SimpleGrid>
          {error ? (
            <Text color={flowPalette.error} fontSize="sm" textAlign="center" mb={4}>
              {error}
            </Text>
          ) : null}
          <Stack gap={2}>
            <Button
              type="button"
              loading={pending}
              bg={flowPalette.maroon}
              color={flowPalette.pageBg}
              _hover={{ bg: flowPalette.maroonDark }}
              size="lg"
              width="full"
              onClick={() => void finish()}
            >
              {pending ? '…' : 'Begin the revolution ★'}
            </Button>
            <Button
              type="button"
              variant="ghost"
              color={flowPalette.muted}
              onClick={() => setStep(3)}
            >
              Back
            </Button>
          </Stack>
        </FlowCard>
      ) : null}
    </AuthenticationWizard>
  );
}
