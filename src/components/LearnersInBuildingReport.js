import React, {Component} from 'react'
import axios from 'axios'
import Card from 'react-toolbox/lib/card/Card'
import CardText from 'react-toolbox/lib/card/CardText'
import CardTitle from 'react-toolbox/lib/card/CardTitle'
import Table from 'react-toolbox/lib/table/Table'
import TableCell from 'react-toolbox/lib/table/TableCell'
import TableRow from 'react-toolbox/lib/table/TableRow'


class LearnersInBuildingReport extends Component {
  constructor(props) {
    super(props)
    this.state = {
      reportData: ''
    }
  }

  componentDidMount() {
    // axios.get('/api/reports/create-learners-in-building-report')
    //   .then(response => {
    //     this.setState({reportData: response.data})
    //   }).catch(err => {
    //     console.log(err.message)
    //   })
  }

  render() {
    if (this.state.reportData) {
      return (
        <Card style={{marginTop: '2em'}}>
          {/* <CardTitle title='Learners in Building Report'/>
          <CardText> */}
            {/* <Table selectable={false} style={{ marginTop: '1em', tableLayout: 'fixed', width: '100%' }}>
              <TableRow style={{backgroundColor: '#e7f0f7'}}>
                <TableCell><strong>Name</strong></TableCell>
                <TableCell numeric><strong>Verified Salary (Vemo)</strong></TableCell>
                <TableCell numeric><strong>Reported Salary (LG)</strong></TableCell>
                <TableCell><strong>Job Title</strong></TableCell>
                <TableCell numeric><strong>Job Start Date</strong></TableCell>
                <TableCell><strong>Full Time/Part Time</strong></TableCell>
                <TableCell><strong>In Field</strong></TableCell>
                <TableCell numeric><strong>Weekly Part-Time Hours</strong></TableCell>
              </TableRow>
              {this.state.reportData.map((item, idx) => {
                item.job_start_date = item.job_start_date ? moment(item.job_start_date).format('YYYY-MM-DD') : ''
                return (
                  <TableRow key={idx}>
                    <TableCell>{item.firstname} {item.lastname}</TableCell>
                    <TableCell numeric>${item.learner_s_starting_salary}</TableCell>
                    <TableCell numeric>${item.learner_reported_salary}</TableCell>
                    <TableCell>{item.job_title}</TableCell>
                    <TableCell numeric>{item.job_start_date}</TableCell>
                    <TableCell>{item.employment_type}</TableCell>
                    <TableCell>{item.employed_in_or_out_of_field}</TableCell>
                    <TableCell numeric>{item.weekly_part_time_hours}</TableCell>
                  </TableRow>
                )
              })}
            </Table>
          </CardText> */}
        </Card>
      )
    } else {
      return (
        <div>Getting Report Data</div>
      )
    }
  }
}

export default LearnersInBuildingReport
