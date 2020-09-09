import React, {useState} from 'react';
import {Table, Button} from 'react-bootstrap';
import moment from 'moment-timezone';
import {graphql, createFragmentContainer, RelayProp} from 'react-relay';
import {ReportingYearTable_query} from '__generated__/ReportingYearTable_query.graphql';
import updateReportingYearMutation from 'mutations/reporting_year/updateReportingYearMutation';
import createReportingYearMutation from 'mutations/reporting_year/createReportingYearMutation';
import ReportingYearFormDialog from './ReportingYearFormDialog';
import NewReportingYearFormDialog from './NewReportingYearFormDialog';

const TIME_ZONE = 'America/Vancouver';

interface Props {
  relay: RelayProp;
  query: ReportingYearTable_query;
}

function formatListViewDate(date: string, displayTime?: boolean) {
  if (displayTime)
    return moment.tz(date, TIME_ZONE).format('MMM D, YYYY HH:mm (z)');
  return moment.tz(date, TIME_ZONE).format('MMM D, YYYY');
}

function isDatePast(date: string) {
  const d = moment.tz(date, TIME_ZONE);
  const now = moment.tz(TIME_ZONE);
  return d.isBefore(now);
}

export const ReportingYearTableComponent: React.FunctionComponent<Props> = (
  props
) => {
  const [editingYear, setEditingYear] = useState(null);
  const [dialogMode, setDialogMode] = useState(null);

  const {query, relay} = props;
  if (!query.allReportingYears || !query.allReportingYears.edges) {
    return <div />;
  }

  const existingYearKeys = query.allReportingYears.edges.map((edge) => {
    return edge.node.reportingYear;
  });

  const clearForm = () => {
    setDialogMode(null);
    setEditingYear(null);
  };

  const editYear = (node) => {
    setEditingYear(node);
    setDialogMode('edit');
  };

  const saveReportingYear = async ({formData}) => {
    await updateReportingYearMutation(relay.environment, {
      input: {
        id: editingYear.id,
        reportingYearPatch: {
          ...formData
        }
      }
    });
    clearForm();
  };

  const createReportingYear = async ({formData}) => {
    await createReportingYearMutation(relay.environment, {
      input: {
        reportingYear: {
          ...formData
        }
      }
    });
    clearForm();
  };

  return (
    <>
      <div style={{textAlign: 'right'}}>
        <Button
          style={{marginTop: '-220px'}}
          onClick={() => setDialogMode('create')}
        >
          New Reporting Year
        </Button>
      </div>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th scope="col">Reporting Year</th>
            <th scope="col">Reporting Period Start</th>
            <th scope="col">Reporting Period End</th>
            <th scope="col">Industrial GHG Reporting (SWRS) Deadline</th>
            <th scope="col">Application Open Time</th>
            <th scope="col">Application Close Time</th>
            <th />
          </tr>
        </thead>
        <tbody>
          {query.allReportingYears.edges.map(({node}) => {
            return (
              <tr key={node.id}>
                <td>{node.reportingYear}</td>
                <td>{formatListViewDate(node.reportingPeriodStart)}</td>
                <td>{formatListViewDate(node.reportingPeriodEnd)}</td>
                <td>{formatListViewDate(node.swrsDeadline)}</td>
                <td>{formatListViewDate(node.applicationOpenTime, true)}</td>
                <td>{formatListViewDate(node.applicationCloseTime, true)}</td>
                <td>
                  {!isDatePast(node.applicationCloseTime) && (
                    <Button onClick={() => editYear(node)}>Edit</Button>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </Table>
      <NewReportingYearFormDialog
        show={dialogMode === 'create'}
        createReportingYear={createReportingYear}
        clearForm={clearForm}
        existingYearKeys={existingYearKeys}
      />
      <ReportingYearFormDialog
        show={dialogMode === 'edit'}
        year={editingYear?.reportingYear}
        formFields={editingYear}
        clearForm={clearForm}
        saveReportingYear={saveReportingYear}
      />
    </>
  );
};

export default createFragmentContainer(ReportingYearTableComponent, {
  query: graphql`
    fragment ReportingYearTable_query on Query {
      allReportingYears(orderBy: REPORTING_YEAR_DESC) {
        edges {
          node {
            id
            reportingYear
            reportingPeriodStart
            reportingPeriodEnd
            swrsDeadline
            applicationOpenTime
            applicationCloseTime
          }
        }
      }
    }
  `
});
