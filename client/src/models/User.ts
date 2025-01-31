import type { Report } from './Report';

export interface User {
    username: string | null;
    email: string | null;
    password: string | null;
    savedReports: Report[];
}