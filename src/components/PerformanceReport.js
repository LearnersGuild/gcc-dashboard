import React, {Component} from 'react'
import axios from 'axios'
import Card from 'react-toolbox/lib/card/Card'
import CardText from 'react-toolbox/lib/card/CardText'
import CardTitle from 'react-toolbox/lib/card/CardTitle'
import Tabs from 'react-toolbox/lib/tabs/Tabs'
import Tab from 'react-toolbox/lib/tabs/Tab'
import moment from 'moment-timezone'
import cardStyle from './cardStyle'
import PerformanceReportPhaseAdvancementTable from './PerformanceReportPhaseAdvancementTable'
import PerformanceReportAttemptsTable from './PerformanceReportAttemptsTable'


class PerformanceReport extends Component {
  constructor(props) {
    super(props)
    this.state = {
      reportData: '',
      advancementIndex: 0,
      attemptsIndex: 0
    }
    this.handleAdvancementTabChange = this.handleAdvancementTabChange.bind(this)
    this.handleAttemptsTabChange = this.handleAttemptsTabChange.bind(this)
  }

  componentDidMount() {
    axios.get('/api/reports/createperformancereport')
      .then(response => {
        this.setState({reportData: response.data})
      }).catch(err => {
        console.log(err.message)
      })
  }

  handleAdvancementTabChange(index) {
      this.setState({advancementIndex: index})
  }

  handleAttemptsTabChange(index) {
      this.setState({attemptsIndex: index})
  }

  render() {
    return (
      <div>
        <div>
          <h3>Phase Advancement by Demographic</h3>
          <Tabs index={this.state.advancementIndex} onChange={this.handleAdvancementTabChange}>
            <Tab label='Phase 1 > Phase 2'>
              <PerformanceReportPhaseAdvancementTable title='Demographic' data={this.state.reportData.demo} phase={'phase1'}/>
            </Tab>
            <Tab label='Phase 2 > Phase 3'>
              <PerformanceReportPhaseAdvancementTable title='Demographic' data={this.state.reportData.demo} phase={'phase2'}/>
            </Tab>
            <Tab label='Phase 3 > Phase 4'>
              <PerformanceReportPhaseAdvancementTable title='Demographic' data={this.state.reportData.demo} phase={'phase3'}/>
            </Tab>
            <Tab label='Phase 4 > Phase 5'>
              <PerformanceReportPhaseAdvancementTable title='Demographic' data={this.state.reportData.demo} phase={'phase4'}/>
            </Tab>
            <Tab label='Phase 5 > Graduation'>
              <PerformanceReportPhaseAdvancementTable title='Demographic' data={this.state.reportData.demo} phase={'phase5'}/>
            </Tab>
            <Tab label='Total'>
              <PerformanceReportPhaseAdvancementTable title='Demographic' data={this.state.reportData.demo} phase={'total'}/>
            </Tab>
          </Tabs>
        </div>
        <div>
          <h3>Phase Advancement by Cohort</h3>
          <Tabs index={this.state.advancementIndex} onChange={this.handleAdvancementTabChange}>
            <Tab label='Phase 1 > Phase 2'>
              <PerformanceReportPhaseAdvancementTable title='Cohort' data={this.state.reportData.cohort} phase={'phase1'}/>
            </Tab>
            <Tab label='Phase 2 > Phase 3'>
              <PerformanceReportPhaseAdvancementTable title='Cohort' data={this.state.reportData.cohort} phase={'phase2'}/>
            </Tab>
            <Tab label='Phase 3 > Phase 4'>
              <PerformanceReportPhaseAdvancementTable title='Cohort' data={this.state.reportData.cohort} phase={'phase3'}/>
            </Tab>
            <Tab label='Phase 4 > Phase 5'>
              <PerformanceReportPhaseAdvancementTable title='Cohort' data={this.state.reportData.cohort} phase={'phase4'}/>
            </Tab>
            <Tab label='Phase 5 > Graduation'>
              <PerformanceReportPhaseAdvancementTable title='Cohort' data={this.state.reportData.cohort} phase={'phase5'}/>
            </Tab>
            <Tab label='Total'>
              <PerformanceReportPhaseAdvancementTable title='Cohort' data={this.state.reportData.cohort} phase={'total'}/>
            </Tab>
          </Tabs>
        </div>
        <div>
          <h3>Phase Attempts</h3>
          <Tabs index={this.state.attemptsIndex} onChange={this.handleAttemptsTabChange}>
            <Tab label='Phase 2 Assessment'>
              <PerformanceReportAttemptsTable title='Cohort' data={this.state.reportData.weekInPhase} phase={'phase1'}/>
            </Tab>
            <Tab label='Phase 3 Assessment'>
              <PerformanceReportAttemptsTable title='Cohort' data={this.state.reportData.weekInPhase} phase={'phase2'}/>
            </Tab>
            <Tab label='Phase 4 Assessment'>
              <PerformanceReportAttemptsTable title='Cohort' data={this.state.reportData.weekInPhase} phase={'phase3'}/>
            </Tab>
          </Tabs>
        </div>
      </div>
    )
  }
}

export default PerformanceReport
