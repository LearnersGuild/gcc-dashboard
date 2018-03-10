import React, {Component} from 'react'
import axios from 'axios'
import DatePicker from 'react-toolbox/lib/date_picker/DatePicker'
import Button from 'react-toolbox/lib/button/Button'
import Card from 'react-toolbox/lib/card/Card'
import CardText from 'react-toolbox/lib/card/CardText'
import CardTitle from 'react-toolbox/lib/card/CardTitle'
import Tabs from 'react-toolbox/lib/tabs/Tabs'
import Tab from 'react-toolbox/lib/tabs/Tab'
import moment from 'moment-timezone'
import cardStyle from './cardStyle'
import JobsReportTable from './JobsReportTable'
import JobsReportIncomeAvgTable from './JobsReportIncomeAvgTable'
import JobsReportIncomeCountTable from './JobsReportIncomeCountTable'
import JobsReportIncomeComparisonTable from './JobsReportIncomeComparisonTable'
import JobsReportPlacementRateTable from './JobsReportPlacementRateTable'
import JobsReportPlacementTable from './JobsReportPlacementTable'

class JobsReport extends Component {
  constructor(props) {
    super(props)
    this.state = {
      reportDate: moment().subtract(1, 'days').toDate(),
      reportStart: moment().format('YYYY-MM-DD'),
      reportEnd: moment().add(1, 'days').format('YYYY-MM-DD'),
      index: 0,
      reportData: ''
    }
    this.handleSubmit = this.handleSubmit.bind(this)
    this.handleChange = this.handleChange.bind(this)
    this.handleTabChange = this.handleTabChange.bind(this)
  }

  componentDidMount() {
    this.handleSubmit()
  }

  handleTabChange(index) {
    this.setState({index})
  }

  handleSubmit() {
    if (this.state.reportDate === '') {
      alert('Please select a date for the report')
    } else {
      axios.get('/api/reports/createjobsreport', {params: {reportStart: this.state.reportStart, reportEnd: this.state.reportEnd}})
      .then(response => {
        this.setState({reportData: response.data})
      }).catch(err => {
        console.log(err.message)
      })
    }
  }

  handleChange(date) {
    this.setState({
      reportDate: moment(date).toDate(),
      reportStart: moment(date).add(1, 'days').format('YYYY-MM-DD'),
      reportEnd: moment(date).add(2, 'days').format('YYYY-MM-DD')
    })
  }

  render() {
    return (
      <div>
        <Card style={cardStyle()}>
          <CardTitle title="Placement Rate"/>
          <CardText>
            <JobsReportPlacementRateTable data={this.state.reportData.total}/>
          </CardText>
        </Card>
        <Card style={cardStyle()}>
          <CardTitle title="Post Guild Income Avg"/>
          <CardText>
            <JobsReportIncomeAvgTable data={this.state.reportData.postGuildIncome}/>
          </CardText>
        </Card>
        <Card style={cardStyle()}>
          <CardTitle title="Post Guild Income Ranges"/>
          <CardText>
            <JobsReportIncomeCountTable data={this.state.reportData.postGuildIncome}/>
          </CardText>
        </Card>
        <div style={{marginTop: '3em', marginBottom: '3em'}}>
          <h3>Placement by Exit Date</h3>
          <JobsReportPlacementTable data={this.state.reportData.byExit}/>
        </div>
        <div>
          <Card style={cardStyle()}>
            <CardTitle title="Select Report Date"/>
            <CardText>
              <DatePicker
                icon="event"
                label="Select a Report Date"
                onChange={this.handleChange}
                maxDate={moment().subtract(1, 'days').toDate()}
                minDate={moment('2017-09-05').toDate()}
                value={this.state.reportDate}
              />
              <Button
                label="Update"
                style={{
                  backgroundColor: '#97C93D',
                  color: 'white',
                  marginTop: '2em',
                  marginLeft: '1em'
                }}
                raised={true}
                onMouseUp={this.handleSubmit}
              />
            </CardText>
          </Card>
          <div style={{marginTop: '3em'}}>
            <h3>In Field Full Time</h3>
            <Tabs index={this.state.index} onChange={this.handleTabChange}>
              <Tab label='By Cohort'>
                <JobsReportTable title='Cohort' data={this.state.reportData.byCohort} total={this.state.reportData.total} type='FullTime'/>
              </Tab>
              <Tab label='By Gender'>
                <JobsReportTable title='Gender' data={this.state.reportData.byGender} total={this.state.reportData.total} type='FullTime'/>
              </Tab>
              <Tab label='By Prior Income'>
                <JobsReportTable title='Prior Income' data={this.state.reportData.byIncome} total={this.state.reportData.total} type='FullTime'/>
              </Tab>
              <Tab label='By Race'>
                <JobsReportTable title='Race' data={this.state.reportData.byRace} total={this.state.reportData.total} type='FullTime'/>
              </Tab>
              <Tab label='By Weeks in Program'>
                <JobsReportTable title='Weeks in Program' data={this.state.reportData.byWeeksInProgram} total={this.state.reportData.total} type='FullTime'/>
              </Tab>
              <Tab label='Income Comparison'>
                <JobsReportIncomeComparisonTable data={this.state.reportData.incomeComparison} type='fullTime'/>
              </Tab>
            </Tabs>
          </div>
          <div style={{marginTop: '3em'}}>
            <h3>In Field Part Time</h3>
            <Tabs index={this.state.index} onChange={this.handleTabChange}>
              <Tab label='By Cohort'>
                <JobsReportTable title='Cohort' data={this.state.reportData.byCohort} total={this.state.reportData.total} type='PartTime'/>
              </Tab>
              <Tab label='By Gender'>
                <JobsReportTable title='Gender' data={this.state.reportData.byGender} total={this.state.reportData.total} type='PartTime'/>
              </Tab>
              <Tab label='By Prior Income'>
                <JobsReportTable title='Prior Income' data={this.state.reportData.byIncome} total={this.state.reportData.total} type='PartTime'/>
              </Tab>
              <Tab label='By Race'>
                <JobsReportTable title='Race' data={this.state.reportData.byRace} total={this.state.reportData.total} type='PartTime'/>
              </Tab>
              <Tab label='By Weeks in Program'>
                <JobsReportTable title='Weeks in Program' data={this.state.reportData.byWeeksInProgram} total={this.state.reportData.total} type='PartTime'/>
              </Tab>
              <Tab label='Income Comparison'>
                <JobsReportIncomeComparisonTable data={this.state.reportData.incomeComparison} type='partTime'/>
              </Tab>
            </Tabs>
          </div>
        </div>
      </div>
    )
  }
}

export default JobsReport
