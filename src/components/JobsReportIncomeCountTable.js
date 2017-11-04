import React, {Component} from 'react'
import Table from 'react-toolbox/lib/table/Table'
import TableHead from 'react-toolbox/lib/table/TableHead'
import TableCell from 'react-toolbox/lib/table/TableCell'
import TableRow from 'react-toolbox/lib/table/TableRow'

class JobsReportIncomeCountTable extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    if (this.props.data) {
      const reportData = this.props.data
    return (
      <Table selectable={false}>
        {reportData.counts.map((item, idx) => (
          <TableRow key={idx}>
            <TableCell>{item.segment}</TableCell>
            <TableCell numeric>{item.Count}</TableCell>
            <TableCell numeric>{((item.Count / reportData.total) * 100).toFixed(0)}%</TableCell>
          </TableRow>
        ))}
        <TableRow>
          <TableCell><strong>Total In Jobs</strong></TableCell>
          <TableCell numeric><strong>{reportData.total}</strong></TableCell>
          <TableCell numeric><strong>100%</strong></TableCell>
        </TableRow>
      </Table>
    )
    } else {
      return (
        <div>Getting Report Data</div>
      )
    }
  }
}

export default JobsReportIncomeCountTable
