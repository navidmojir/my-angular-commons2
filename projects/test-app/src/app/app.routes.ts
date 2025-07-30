import { Routes } from '@angular/router';
import { TicketDetails } from './ticket-details/ticket-details';
import { Tickets } from './tickets/tickets';

export const routes: Routes = [
    {
        path: '',
        component: Tickets
    },
    {
        path: 'tickets',
        component: Tickets
    },
    {
        path: 'ticket-details',
        component: TicketDetails
    },
    {
        path: 'ticket-details/:id',
        component: TicketDetails
    }
];
