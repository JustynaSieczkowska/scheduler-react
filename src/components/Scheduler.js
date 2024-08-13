import React, { useState, useEffect } from 'react';
import {
  Scheduler,
  WeekView,
  MonthView,
  DayView,
  Appointments,
  AppointmentForm,
  AppointmentTooltip,
  Toolbar,
  ViewSwitcher,
  DateNavigator,
  TodayButton,
  EditRecurrenceMenu,
  AllDayPanel,
  DragDropProvider,
} from '@devexpress/dx-react-scheduler-material-ui';
import { ViewState, EditingState, IntegratedEditing } from '@devexpress/dx-react-scheduler';
import { Paper, Button, MenuItem, TextField } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import plLocale from 'date-fns/locale/pl';
import enUSLocale from 'date-fns/locale/en-US';
import { addEvents, getEvents } from './FirebaseServices'; 

const useStyles = makeStyles({
  appointment: {
    backgroundColor: '#7c193f',
    color: '#ffffff',
  },
});

const allDayLocalizationMessages = {
  'pl-PL': {
    allDay: 'Cały dzień',
  },
  'en-US': {
    allDay: 'All Day',
  },
};

const messages = {
  'pl-PL': {
    moreInformationLabel: 'Więcej informacji',
    titleLabel: 'Tytuł',
    commitCommand: 'Zapisz',
    never: 'Nigdy',
    detailsLabel: 'Szczegóły',
    allDayLabel: 'Cały dzień',
    repeatLabel: 'Powtarzaj',
    notesLabel: 'Notatki',
    dailyLabel: 'Codziennie',
    weeklyLabel: 'Co tydzień',
    monthlyLabel: 'Co miesiąc',
    yearlyLabel: 'Co rok',
    repeatEveryLabel: 'Powtarzaj co',
    daysLabel: 'Dni',
    endRepeatLabel: 'Koniec powtarzania',
    onLabel: 'W dniu',
    afterLabel: 'Po',
    occurrencesLabel: 'powtórzeń',
    deleteButton: 'Usuń',
    cancelButton: 'Anuluj',
    saveButton: 'Zapisz',
    openButton: 'Otwórz',
    everyLabel: 'Co',
    theLabel: 'W dniu',
    yearsLabel: 'Rok/lata',
    monthlLabel: 'Miesiąc/e',
    weeksLabel: 'Tydzień/tygodnie',
    recurrenceRepeatLabel: 'Powtarzaj',
    recurrenceEndLabel: 'Koniec powtarzania',
    monthsLabel: 'Miesiąc',
    ofEveryMonthLabel: 'każdego miesiąca',
    firstLabel: 'Pierwszy',
    secondLabel: 'Drugi',
    thirdLabel: 'Trzeci',
    fourthLabel: 'Czwarty',
    lastLabel: 'Ostatni',
    yearLabel: 'Rok',
    repeatOnLabel: 'Powtarzaj w',
    repeatEveryWeekLabel: 'Powtarzaj co tydzień na',
    repeatEveryMonthLabel: 'Powtarzaj co miesiąc na',
    onDaysLabel: 'W dniach',
    weeksOnLabel: 'tydzień na',
    daily: 'Codziennie',
    weekly: 'Co tydzień',
    monthly: 'Co miesiąc',
    yearly: 'Co roku',
    
  },
  'en-US': {
    moreInformationLabel: 'More information',
    titleLabel: 'Title',
    commitCommand: 'Save',
    never: 'Never',
    detailsLabel: 'Details',
    allDayLabel: 'All Day',
    repeatLabel: 'Repeat',
    notesLabel: 'Notes',
    dailyLabel: 'Daily',
    weeklyLabel: 'Weekly',
    monthlyLabel: 'Monthly',
    yearlyLabel: 'Yearly',
    repeatEveryLabel: 'Repeat every',
    daysLabel: 'Days',
    endRepeatLabel: 'End repeat',
    onLabel: 'On',
    afterLabel: 'After',
    occurrencesLabel: 'occurrences',
    deleteButton: 'Delete',
    cancelButton: 'Cancel',
    saveButton: 'Save',
    openButton: 'Open',
    everyLabel: 'Every',
    theLabel: 'The',
    yearsLabel: 'Year/Years',
    monthlLabel: 'Month/Months',
    weeksLabel: 'Week/Weeks',
    recurrenceRepeatLabel: 'Repeat',
    recurrenceEndLabel: 'End Repeat',
    monthsLabel: 'Month',
    ofEveryMonthLabel: 'of every month',
    firstLabel: 'First',
    secondLabel: 'Second',
    thirdLabel: 'Third',
    fourthLabel: 'Fourth',
    lastLabel: 'Last',
    yearLabel: 'Year',
    repeatOnLabel: 'Repeat on',
    repeatEveryWeekLabel: 'Repeat every week on',
    repeatEveryMonthLabel: 'Repeat every month on',
    onDaysLabel: 'On days',
    weeksOnLabel: 'week on',
    daily: 'Daily',
    weekly: 'Weekly',
    monthly: 'Monthly',
    yearly: 'Yearly',
    
  },
};

const SchedulerComponent = () => {
  const classes = useStyles();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [data, setData] = useState([]);
  const [currentViewName, setCurrentViewName] = useState('Week');
  const [locale, setLocale] = useState('pl-PL');

  useEffect(() => {
    const fetchData = async () => {
      const events = await getEvents();
      setData(events);
    };
    fetchData();
  }, []);

  const commitChanges = ({ added, changed, deleted }) => {
    let updatedData = [...data];
    if (added) {
      const startingAddedId = data.length > 0 ? data[data.length - 1].id + 1 : 0;
      const newEvent = { id: startingAddedId, ...added };
      updatedData = [...updatedData, newEvent];
      addEvents(newEvent); 
    }
    if (changed) {
      updatedData = updatedData.map(appointment =>
        changed[appointment.id] ? { ...appointment, ...changed[appointment.id] } : appointment,
      );
    
    }
    if (deleted !== undefined) {
      updatedData = updatedData.filter(appointment => appointment.id !== deleted);
      
    }
    setData(updatedData);
  };

  const CustomTodayButton = (props) => (
    <TodayButton
      {...props}
      messages={{ today: locale === 'pl-PL' ? 'Dzisiaj' : 'Today' }}
    />
  );

  const CustomViewSwitcher = (props) => (
    <ViewSwitcher
      {...props}
      switcherComponent={({ currentViewName, onChange }) => (
        <>
          <Button onClick={() => onChange('Day')} color="primary">
            {locale === 'pl-PL' ? 'Dzień' : 'Day'}
          </Button>
          <Button onClick={() => onChange('Week')} color="primary">
            {locale === 'pl-PL' ? 'Tydzień' : 'Week'}
          </Button>
          <Button onClick={() => onChange('Month')} color="primary">
            {locale === 'pl-PL' ? 'Miesiąc' : 'Month'}
          </Button>
        </>
      )}
    />
  );

  return (
    <LocalizationProvider
      dateAdapter={AdapterDateFns}
      adapterLocale={locale === 'pl-PL' ? plLocale : enUSLocale}
    >
      <Paper>
        <TextField
          select
          label={locale === 'pl-PL' ? 'Wybierz język' : 'Select Language'}
          value={locale}
          onChange={(event) => setLocale(event.target.value)}
          style={{ marginBottom: '20px' }}
        >
          <MenuItem value="pl-PL">Polski</MenuItem>
          <MenuItem value="en-US">English</MenuItem>
        </TextField>

        <Scheduler
          data={data}
          locale={locale}
        >
          <ViewState
            currentDate={currentDate}
            onCurrentDateChange={setCurrentDate}
            currentViewName={currentViewName}
            onCurrentViewNameChange={setCurrentViewName}
          />
          <EditingState onCommitChanges={commitChanges} />
          <IntegratedEditing />

          <DayView startDayHour={9} endDayHour={19} />
          <WeekView startDayHour={9} endDayHour={19} />
          <MonthView />

          <Toolbar />
          <DateNavigator />
          <CustomTodayButton />
          <CustomViewSwitcher />

          <EditRecurrenceMenu />
          <Appointments
            appointmentComponent={(props) => (
              <Appointments.Appointment {...props} className={classes.appointment} />
            )}
          />
          <AppointmentTooltip
            showOpenButton
            showDeleteButton
            showCloseButton
            messages={messages[locale]}
          />
          <AppointmentForm messages={messages[locale]} />
          <AllDayPanel messages={allDayLocalizationMessages[locale]} />
          <DragDropProvider />
        </Scheduler>
      </Paper>
    </LocalizationProvider>
  );
};

export default SchedulerComponent;
