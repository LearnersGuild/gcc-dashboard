import React from 'react'
import Card from 'react-toolbox/lib/card/Card'
import CardText from 'react-toolbox/lib/card/CardText'
import CardTitle from 'react-toolbox/lib/card/CardTitle'

const pStyle = () => {
  return {
    marginTop: '1em',
  }
}

const DashboardKey = () => {
  return (
    <div>
      <Card style={{width: "75%", marginBottom: "2em"}}>
        <CardTitle title='Jobs Report' />
        <CardText>
          <p style={pStyle()}><strong>Placement Rate</strong> is calculated by dividing the number of graduates
            gainfully employed in the field by the number of graduates available for employment.
          </p>
          <p><em>(In Full Time Job In Field + In Part Time Job In Field)  / (In Full Time Job In Field
            + In Part Time Job In Field  + In Job Search)</em></p>
          <p style={pStyle()}><strong>In Job Search</strong> means Learners who have exited the Guild and are not yet
            employed in the field.
          </p>
          <p><em>Exit Type = (Graduated Early + Graduated Early w/ Job + Graduated On Time + Graduated
            Post 40 Weeks) and Exit Date {'<='} Today and Employed In Field != Yes</em>
          </p>
          <p style={pStyle()}><strong>In Full Time Jobs</strong> means Learners who have exited the Guild and are
            employed in full-time positions in the field.
          </p>
          <p><em>Exit Type = (Graduated Early + Graduated Early w/ Job + Graduated On Time +
            Graduated Post 40 Weeks) and Exit Date {'<='} Today and Employed In Field = Yes and
            Employed Full or Part Time = Full Time Position</em>
          </p>
          <p style={pStyle()}><strong>In Part Time Jobs</strong> means Learners who have exited the Guild and are 
            employed in part-time positions in the field.
          </p>
          <p><em>Exit Type = (Graduated Early + Graduated Early w/ Job + Graduated On Time + Graduated
            Post 40 Weeks) and Exit Date {'<='} Today and Employed In Field = Yes and Employed Full or
            Part Time = Part Time Position</em>
          </p>
          <p style={pStyle()}><strong>Total In Jobs</strong> means Learners who have exited the Guild and are employed in full or 
            part-time positions in the field.
          </p>
          <p><em>In Full Time Jobs + In Part Time Jobs</em></p>
          <p style={pStyle()}><strong>Total Graduated</strong> means Learners who have exited the Guild as a graduate.</p>
          <p><em>Exit Type = (Graduated Early + Graduated Early w/ Job + Graduated On Time + Graduated
            Post 40 Weeks) and Exit Date {'<='} Today</em>
          </p>
          <p style={pStyle()}><strong>Post Guild Income Avg and Post Guild Income Ranges</strong> data includes Learners
            who have exited the Guild and are employed with verified income.
          </p>
        </CardText>
      </Card>
      <Card style={{width: "75%"}}>
        <CardTitle title='ISA Report' />
        <CardText>      
          <p style={pStyle()}><strong>ISA Payment Rate</strong> is calculated by dividing the number
            of Learners who are current on their payments by the number of Learners who have exited
            the program with active ISAs that are currently In Payment
          </p>
          <p><em>Current on Payment / In Payment</em></p>

          <h3><em>Exited Learner Summary</em></h3>
          <p style={pStyle()}><strong>Exited w/Active ISAs</strong> means that the Learner has exited
            the program prior to today and they have either a PIF or LLF ISA and one or both of their
            ISAs has not been cancelled or written off.
          </p>
          <p><em>(Has Program ISA or Has Stipend ISA = TRUE) and (PIF Status or LLF Status != Cancelled
            or Cancelled/Written Off) and Exit date {'<'} today.</em>
          </p>
          <p style={pStyle()}><strong>In School/Pending ISA Adj</strong> means that the Learner has
            at least one active ISA and Vemo is waiting on us to submit an ISA adjustment form
          </p>
          <p><em>Value assigned and updated by Vemo</em></p>
          <p style={pStyle()}><strong>In Grace</strong> means that the Learner has at least one active
            ISA and they are within three* months of their exit date from the Guild. *The three month
            Grace Period starts on the first day of the next month after a Learner’s exit date.
          </p>
          <p><em>Value assigned and updated by Vemo</em></p>
          <p style={pStyle()}><strong>In Transition</strong> means that the Learner has at least one
            active ISA and they are in their first “income month” during their payment period - so
            they don’t owe anything that month, but it’s the first month that they are required to
            report their income to Vemo.
          </p>
          <p><em>Vemo assigned = Payment and First Payment Due Date > Today + 1 week</em></p>
          <p style={pStyle()}><strong>In Payment</strong> means that the Learner has at least one
            active ISA and their PIF Status/LLF Status  = Payment and their PIF/LLF First Payment
            Due Date is in the past.
          </p>
          <p><em>Vemo assigned = Payment and First Payment Due Date {'<'} Today</em></p>
          <p style={pStyle()}><strong>In Deferment</strong> means that the Learner has at least one
            active ISA and their PIF Status/LLF Status = Deferment.
          </p>
          <p><em>Value assigned and updated by Vemo</em></p>
          <p style={pStyle()}><strong>Income Docs Received</strong> means that the Learner has at
            least one active ISA and they have had their income verified by Vemo.
          </p>
          <p><em>Value assigned and updated by Vemo</em></p>
          <p style={pStyle()}><strong>Payments Made</strong>means that the Learner has at least one
            active ISA and has made at least 1 payment.
          </p>
          <p><em>Value assigned and updated by Vemo</em></p>
          <p style={pStyle()}><strong>Past Due</strong> means that the Learner is in Payment, but
            are behind on their payments.
          </p>
          <p><em>Vemo assigned value ISA Payments Past Due = True</em></p>
          <p style={pStyle()}><strong>Current on Payments</strong> means that the Learner is in
            Payment and their is current on all of their payments.
          </p>
          <p><em>Vemo assigned value ISA Payments Past Due != True</em></p>
          
          <h3><em>Exited Learner Details</em></h3>
          <p style={pStyle()}><strong>Name</strong> is the Learner’s first and last name.</p>
          <p style={pStyle()}><strong>Start Date</strong> is the date that the Learner started the
            program.
          </p> 
          <p style={pStyle()}><strong>Exit Date</strong> is the date that the Learner exited from
            the program.
          </p>
          <p style={pStyle()}><strong>First Payment Due Date</strong> is the date that the Learner’s
            first ISA payment is due.
          </p>
          <p><em>Value assigned and updated by Vemo</em></p>
          <p style={pStyle()}><strong>Starting Salary</strong> is the Learner’s starting salary.
            Values that have an asterix (*) are based on what the Learner reported to us, but are not
            verified. Values without an asterix have been verified by Vemo through income documentation.
          </p>
          <p style={pStyle()}><strong>Payment Status</strong> values vary based on which payment
            bucket the Learner falls into. If the learner is In School/Pending ISA Adjustment, In
            Grace, or In Transition, the value reflects that status. If the Learner is In Deferment,
            the value represents their deferment type (e.g. Unemployed, seeking employment). If the
            Learner is In Payment, the value represents their payment status (Past Due or Current). 
          </p>
          <p style={pStyle()}><strong>Income Docs Received</strong> states whether the Learner has
            submitted income documents to Vemo - Yes or No.
          </p>
          <p><em>Vemo assigned value</em></p>
          <p style={pStyle()}><strong>Monthly Payment Amount</strong> is the total payment amount
            (all active ISAs) that the Learner is responsible to pay based on their current salary.
            This amount is estimated for any Learners who have yet to supply income documentation to
            Vemo.
          </p>
          <p><em>Vemo assigned value</em></p>
          <p style={pStyle()}><strong>Total # Payments Made</strong> is the number of monthly
            payments that the Learner has made.
          </p>
          <p><em>Vemo assigned value</em></p>
          <p style={pStyle()}><strong>PIF %</strong> is the percent of income that the Learner will pay
            monthly from any Pay It Forward ISAs.
          </p>
          <p style={pStyle()}><strong>LLF %</strong> is the percent of income that the Learner will
            pay monthly from any Learner’s Living Fund ISAs.
          </p>
        </CardText>
      </Card>
    </div>
  )
}

export default DashboardKey
