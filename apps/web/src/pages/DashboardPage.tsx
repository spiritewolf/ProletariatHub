import { Box, Button, Flex, Heading, Text } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { dashboardSummarySchema, type DashboardSummary } from '@proletariat-hub/contracts';
import { apiJsonValidated } from '../api';
import { useAuth } from '../auth/AuthContext';

export function DashboardPage() {
  const { authenticatedComrade, logout } = useAuth();
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      try {
        const data = await apiJsonValidated('/api/dashboard/summary', dashboardSummarySchema);
        if (!cancelled) {
          setSummary(data);
        }
      } catch (e) {
        if (!cancelled) {
          setError(e instanceof Error ? e.message : 'Failed to load dashboard');
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  if (!authenticatedComrade) {
    return <Navigate to="/login" replace />;
  }
  if (authenticatedComrade.mustChangePassword) {
    return <Navigate to="/change-password" replace />;
  }
  if (authenticatedComrade.isAdmin && !authenticatedComrade.hasCompletedSetup) {
    return <Navigate to="/setup" replace />;
  }

  return (
    <Box maxW="48rem" mx="auto" py={10} px={5} color="#e8e8ef">
      <Flex as="header" justify="space-between" align="flex-start" gap={4} flexWrap="wrap">
        <Box>
          <Heading as="h1" size="lg" fontWeight="semibold" letterSpacing="-0.02em" mb={1}>
            ProletariatHub
          </Heading>
          <Text color="#8b8b9a" fontSize="sm">
            {summary?.hubName ?? authenticatedComrade.hubName}
          </Text>
        </Box>
        <Button
          type="button"
          variant="ghost"
          color="#8b8b9a"
          _hover={{ color: '#e8e8ef', bg: 'whiteAlpha.100' }}
          onClick={() => {
            void logout();
          }}
        >
          Log out
        </Button>
      </Flex>

      {error ? (
        <Text color="#f87171" mt={4} fontSize="sm">
          {error}
        </Text>
      ) : null}

      <Box
        as="section"
        mt={8}
        p={5}
        borderRadius="xl"
        borderWidth="1px"
        borderColor="#24242c"
        bg="#16161c"
      >
        <Heading as="h2" size="sm" fontWeight="semibold" color="#c4c4d0" mb={4}>
          Dashboard
        </Heading>
        {summary ? (
          <>
            <Text fontSize="lg" mb={2}>
              {summary.greeting}
            </Text>
            <Text color="#8b8b9a" fontSize="sm" mb={summary.urgentLine ? 3 : 0}>
              {summary.today}
            </Text>
            {summary.urgentLine ? (
              <Text color="#fca5a5" fontSize="sm">
                {summary.urgentLine}
              </Text>
            ) : null}
          </>
        ) : (
          <Text color="#8b8b9a" fontSize="sm">
            Loading the collective briefing…
          </Text>
        )}
        <Text color="#8b8b9a" fontSize="sm" mt={6} fontStyle="italic">
          Chores, lists, calendar, and docs will land here — the shelves are bare for now, Comrade.
        </Text>
      </Box>
    </Box>
  );
}
