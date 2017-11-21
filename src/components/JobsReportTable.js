import React, {Component} from 'react'
import Table from 'react-toolbox/lib/table/Table'
import TableHead from 'react-toolbox/lib/table/TableHead'
import TableCell from 'react-toolbox/lib/table/TableCell'
import TableRow from 'react-toolbox/lib/table/TableRow'

class JobsReportTable extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    if (this.props.data) {
      const reportData = this.props.data
      const total = this.props.total[0]
      const type = this.props.type
    return (
      <Table selectable={false} style={{ marginTop: 10 }}>
        <TableHead>
          <TableCell>{this.props.title}</TableCell>
          <TableCell numeric>In Job Search</TableCell>
          <TableCell numeric>In Job</TableCell>
          <TableCell numeric>Avg Salary</TableCell>
          <TableCell numeric>Avg Reported Salary</TableCell>
        </TableHead>
        {reportData.map((item, idx) => (
          <TableRow key={idx}>
            <TableCell>{item.segment}</TableCell>
            <TableCell numeric>{item.inJobSearch}</TableCell>
            <TableCell numeric>{item[`inJob${type}`]}</TableCell>
            <TableCell numeric>${item[`avgSalary${type}`]}</TableCell>
            <TableCell numeric>${item[`avgReportedSalary${type}`]}</TableCell>
          </TableRow>
        ))}
        <TableRow>
            <TableCell><strong>{total.segment}</strong></TableCell>
            <TableCell numeric><strong>{total.inJobSearch}</strong></TableCell>
            <TableCell numeric><strong>{total[`inJob${type}`]}</strong></TableCell>
            <TableCell numeric><strong>${total[`avgSalary${type}`]}</strong></TableCell>
            <TableCell numeric><strong>${total[`avgReportedSalary${type}`]}</strong></TableCell>
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

export default JobsReportTable
