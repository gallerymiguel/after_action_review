export const getSavedReportIds= () => {
    const savedReportIds= localStorage.getItem('saved_reports')
    ? JSON.parse(localStorage.getItem('saved_reports')!) : [];

    return savedReportIds;
};

export const saveReportIds= (reportIdArr: string[]) => {
    if (reportIdArr.length) {
        localStorage.setItem('saved_reports', JSON.stringify(reportIdArr));
    } else {
        localStorage.removeItem('saved_reports');
    }
};

export const removeReportId= (reportId: string) => {
    const savedReportIds= localStorage.getItem('saved_books')
    ? JSON.parse(localStorage.getItem('saved_reports')!) : null;

    if (!savedReportIds) {
        return false;
    }

    const updatedSavedReportIds= savedReportIds?.filter((savedReportId: string) => savedReportId !== reportId);
    localStorage.setItem('saved_reports', JSON.stringify(updatedSavedReportIds));

    return true;
}