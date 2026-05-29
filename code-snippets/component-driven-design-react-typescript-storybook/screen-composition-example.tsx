import type { ReactElement } from 'react';
import { useState } from 'react';
import { CalendarDays, Plus } from 'lucide-react';
import { ScreenContainer, ScreenHeader, PageSection, Stack } from '@/components/layout';
import { SectionHeader, EmptyState, AppointmentCard, ButtonGroup } from '@/components/composite';
import { Button } from '@/components/ui/button';

// This screen contains zero raw HTML elements.
// Every JSX tag is a named component from the component library.
// The no-html-in-screens ESLint rule enforces this structurally —
// a <div> or <h2> in a screen file is a build error, not a convention to remember.

export function DashboardScreen({
  userName,
  appointments,
  onBookNew,
  onCancel,
}: DashboardScreenProps): ReactElement {
  const [showPast, setShowPast] = useState(false);
  const upcoming = appointments.filter(a => a.status === 'upcoming');
  const past = appointments.filter(a => a.status !== 'upcoming');

  return (
    <ScreenContainer maxWidth="lg">
      <ScreenHeader
        title={`Welcome back, ${userName}`}
        subtitle="Manage your upcoming appointments"
        actions={
          <Button onClick={onBookNew}>
            <Plus className="mr-2 h-4 w-4" />
            Book Appointment
          </Button>
        }
      />

      <PageSection>
        <SectionHeader title="Upcoming" />
        {upcoming.length === 0 ? (
          <EmptyState
            icon={CalendarDays}
            title="No upcoming appointments"
            action={{ label: 'Book now', onClick: onBookNew }}
          />
        ) : (
          <Stack spacing="3">
            {upcoming.map(appt => (
              <AppointmentCard
                key={appt.id}
                appointment={appt}
                actions={
                  <ButtonGroup>
                    <Button variant="ghost" size="sm" onClick={() => onCancel(appt.id)}>
                      Cancel
                    </Button>
                  </ButtonGroup>
                }
              />
            ))}
          </Stack>
        )}
      </PageSection>

      <PageSection>
        <SectionHeader
          title="Past Appointments"
          actions={
            past.length > 0 && (
              <Button variant="ghost" size="sm" onClick={() => setShowPast(!showPast)}>
                {showPast ? 'Hide' : `Show (${past.length})`}
              </Button>
            )
          }
        />
        {showPast && (
          <Stack spacing="3">
            {past.map(appt => (
              <AppointmentCard key={appt.id} appointment={appt} muted />
            ))}
          </Stack>
        )}
      </PageSection>
    </ScreenContainer>
  );
}
