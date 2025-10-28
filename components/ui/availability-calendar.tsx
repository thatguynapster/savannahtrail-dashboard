'use client';

import { CalendarDays, Check, X } from 'lucide-react';
import { format, isSameDay } from 'date-fns';
import * as React from 'react';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface AvailabilityDate {
  date: Date;
  isAvailable: boolean;
  bookingId?: string;
  packageName?: string;
}

interface AvailabilityCalendarProps {
  availabilityData: AvailabilityDate[];
  onDateSelect?: (date: Date, isAvailable: boolean) => void;
  onSave?: (dates: AvailabilityDate[]) => void;
  readOnly?: boolean;
  className?: string;
}

export function AvailabilityCalendar({
  availabilityData,
  onDateSelect,
  onSave,
  readOnly = false,
  className,
}: AvailabilityCalendarProps) {
  const [selectedDates, setSelectedDates] = React.useState<AvailabilityDate[]>(availabilityData);
  const [selectedDate, setSelectedDate] = React.useState<Date>(new Date());

  const getDateStatus = (date: Date) => {
    return selectedDates.find(d => isSameDay(d.date, date));
  };

  const handleDateClick = (date: Date) => {
    if (readOnly) return;

    setSelectedDate(date);
    const existingDate = getDateStatus(date);

    if (existingDate) {
      // Toggle availability
      const newAvailability = !existingDate.isAvailable;
      const updatedDates = selectedDates.map(d =>
        isSameDay(d.date, date)
          ? { ...d, isAvailable: newAvailability, bookingId: newAvailability ? undefined : d.bookingId }
          : d
      );
      setSelectedDates(updatedDates);
      onDateSelect?.(date, newAvailability);
    } else {
      // Add new available date
      const newDate: AvailabilityDate = {
        date,
        isAvailable: true,
      };
      setSelectedDates([...selectedDates, newDate]);
      onDateSelect?.(date, true);
    }
  };

  const handleSave = () => {
    onSave?.(selectedDates);
  };

  const modifiers = {
    available: selectedDates.filter(d => d.isAvailable).map(d => d.date),
    booked: selectedDates.filter(d => !d.isAvailable && d.bookingId).map(d => d.date),
    unavailable: selectedDates.filter(d => !d.isAvailable && !d.bookingId).map(d => d.date),
  };

  const modifiersStyles = {
    available: {
      backgroundColor: 'hsl(var(--success))',
      color: 'white',
    },
    booked: {
      backgroundColor: 'hsl(var(--destructive))',
      color: 'white',
    },
    unavailable: {
      backgroundColor: 'hsl(var(--muted))',
      color: 'hsl(var(--muted-foreground))',
    },
  };

  const selectedDateInfo = selectedDate ? getDateStatus(selectedDate) : null;

  return (
    <div className={className}>
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <CalendarDays className="h-5 w-5" />
              <span>Availability Calendar</span>
            </CardTitle>
            <CardDescription>
              {readOnly ? 'View availability status' : 'Click dates to toggle availability'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={(date) => {
                if (date) setSelectedDate(date);
              }}
              onDayClick={handleDateClick}
              modifiers={modifiers}
              modifiersStyles={modifiersStyles}
              className="rounded-md border"
              disabled={readOnly}
            />

            <div className="mt-4 space-y-2">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded-full" />
                <span className="text-sm">Available</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-red-500 rounded-full" />
                <span className="text-sm">Booked</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-gray-400 rounded-full" />
                <span className="text-sm">Unavailable</span>
              </div>
            </div>

            {!readOnly && onSave && (
              <Button onClick={handleSave} className="w-full mt-4">
                <Check className="mr-2 h-4 w-4" />
                Save Changes
              </Button>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Date Information</CardTitle>
            <CardDescription>
              {selectedDate ? format(selectedDate, 'EEEE, MMMM dd, yyyy') : 'Select a date to view details'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {selectedDateInfo ? (
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <span className="font-medium">Status:</span>
                  <Badge
                    className={
                      selectedDateInfo.isAvailable
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100'
                        : selectedDateInfo.bookingId
                          ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100'
                          : 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-100'
                    }
                  >
                    {selectedDateInfo.isAvailable
                      ? 'Available'
                      : selectedDateInfo.bookingId
                        ? 'Booked'
                        : 'Unavailable'}
                  </Badge>
                </div>

                {selectedDateInfo.bookingId && (
                  <div className="space-y-2">
                    <div>
                      <span className="font-medium">Booking ID:</span>
                      <span className="ml-2">{selectedDateInfo.bookingId}</span>
                    </div>
                    {selectedDateInfo.packageName && (
                      <div>
                        <span className="font-medium">Package:</span>
                        <span className="ml-2">{selectedDateInfo.packageName}</span>
                      </div>
                    )}
                  </div>
                )}

                {!readOnly && (
                  <div className="flex space-x-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDateClick(selectedDate)}
                      className="flex-1"
                    >
                      {selectedDateInfo.isAvailable ? (
                        <>
                          <X className="mr-1 h-3 w-3" />
                          Mark Unavailable
                        </>
                      ) : (
                        <>
                          <Check className="mr-1 h-3 w-3" />
                          Mark Available
                        </>
                      )}
                    </Button>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                Select a date from the calendar to view or modify its availability status.
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}