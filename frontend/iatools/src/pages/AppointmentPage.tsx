import React, { useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';

const MyCalendar = () => {
  const [events, setEvents] = useState([
    { title: 'Evento de prueba', date: '2025-06-04' },
    { title: 'Reunión', start: '2025-06-06T10:00:00', end: '2025-06-06T12:00:00' },
  ]);

  const handleDateSelect = (selectInfo: any) => {
    const title = prompt('Introduce el título del evento');
    if (!title) return;

    const endStr = prompt(
      '¿Hasta qué fecha durará el evento? (YYYY-MM-DD)',
      selectInfo.endStr
    );
    if (!endStr) return;

    const isAllDay = !endStr.includes('T'); // si no tiene hora, es evento de todo el día

    let endDate = new Date(endStr);

    // ✅ IMPORTANTE: si es todo el día, sumamos 1 día al "end"
    if (isAllDay) {
      endDate.setDate(endDate.getDate() + 1);
    }

    const newEvent = {
      id: String(events.length + 1),
      title,
      start: selectInfo.startStr,
      end: endDate.toISOString().split('T')[0], // solo la fecha si es allDay
      allDay: isAllDay,
    };

    setEvents([...events, newEvent]);
  };

  return (
    <div className='appointment-page'>
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        headerToolbar={{
          left: 'prev,next today',
          center: 'title',
          right: 'dayGridMonth,timeGridWeek,timeGridDay'
        }}
        selectable={true}
        select={handleDateSelect}
        events={events}
      />
    </div>
  );
};

export default MyCalendar;
