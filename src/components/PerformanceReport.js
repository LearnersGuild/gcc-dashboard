import React, {Component} from 'react'
import axios from 'axios'
import Card from 'react-toolbox/lib/card/Card'
import CardText from 'react-toolbox/lib/card/CardText'
import CardTitle from 'react-toolbox/lib/card/CardTitle'
import Tabs from 'react-toolbox/lib/tabs/Tabs'
import Tab from 'react-toolbox/lib/tabs/Tab'
import PerformanceReportPhaseAdvancementTable from './PerformanceReportPhaseAdvancementTable'
import PerformanceReportAttemptsTable from './PerformanceReportAttemptsTable'
import PerformanceReportPhaseDataTable from './PerformanceReportPhaseDataTable'


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
        <Card style={{maxWidth: '40%', display: 'inline-block'}}>
          <CardTitle title="Current Learners by Phase"/>
          <CardText>
            <PerformanceReportPhaseDataTable data={this.state.reportData.currentLearners}/>
          </CardText>
        </Card>
        <Card style={{maxWidth: '40%', display: 'inline-block', marginLeft: '2em'}}>
          <CardTitle title="Avg Weeks by Phase"/>
          <CardText>
            <PerformanceReportPhaseDataTable data={this.state.reportData.avgWeeks}/>
          </CardText>
        </Card>
        <Card style={{marginTop: '2em'}}>
          <CardTitle title="Current Learners Phase Attempts"/>
          <CardText>
            <Tabs index={this.state.attemptsIndex} onChange={this.handleAttemptsTabChange}>
              <Tab label='Phase 2 Assessment (Currently In Phase 1)'>
                <PerformanceReportAttemptsTable title='Cohort' data={this.state.reportData.weekInPhase} phase={'phase1'}/>
              </Tab>
              <Tab label='Phase 3 Assessment (Currently In Phase 2)'>
                <PerformanceReportAttemptsTable title='Cohort' data={this.state.reportData.weekInPhase} phase={'phase2'}/>
              </Tab>
              <Tab label='Phase 4 Assessment (Currently In Phase 3)'>
                <PerformanceReportAttemptsTable title='Cohort' data={this.state.reportData.weekInPhase} phase={'phase3'}/>
              </Tab>
            </Tabs>
          </CardText>
        </Card>
        <Card style={{marginTop: '2em'}}>
          <CardTitle title='Phase Advancement by Cohort'/>
          <CardText>
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
          </CardText>
        </Card>
        <Card style={{marginTop: '2em'}}>
          <CardTitle title='Phase Advancement by Demographic'/>
          <CardText>
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
          </CardText>
        </Card>
      </div>
    )
  }
}

export default PerformanceReport
