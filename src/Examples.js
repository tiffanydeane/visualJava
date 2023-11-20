import * as React from 'react';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

export default function ControlledAccordions() {
  const [expanded, setExpanded] = React.useState(false);

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  return (
    <div>
      <Accordion sx={{ background: '#2e3440', color: 'white', padding: '2.5px'}} expanded={expanded === 'panel1'} onChange={handleChange('panel1')}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon sx={{ color: 'white' }}/>}
          aria-controls="panel1bh-content"
          id="panel1bh-header"
        >
          <h1>
            Data Structures
          </h1>
        </AccordionSummary>
        <AccordionDetails>
            <ul>
                <li>Singly / Doubly Linked List</li>
                <li>Stack</li>
                <li>Queue</li>
                <li>Binary Search Trees</li>
                <li>Red Black Trees</li>
            </ul>
        </AccordionDetails>
      </Accordion>
      <Accordion sx={{ background: '#2e3440', color: 'white', padding: '2.5px' }} expanded={expanded === 'panel2'} onChange={handleChange('panel2')}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon sx={{ color: 'white' }}/>}
          aria-controls="panel2bh-content"
          id="panel2bh-header"
        >
          <h1>
            Sorting
          </h1>
        </AccordionSummary>
        <AccordionDetails>
            <ul>
                <li>Selection</li>
                <li>Insertion</li>
                <li>Quick</li>
                <li>Merge</li>
            </ul>
        </AccordionDetails>
      </Accordion>
      <Accordion sx={{ background: '#2e3440', color: 'white', padding: '2.5px' }} expanded={expanded === 'panel3'} onChange={handleChange('panel3')}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon sx={{ color: 'white' }}/>}
          aria-controls="panel3bh-content"
          id="panel3bh-header"
        >
          <h1>
            Searching
          </h1>
        </AccordionSummary>

        <AccordionDetails>
        <ul>
                <li>Binary</li>
                <li>BST</li>
                <li>Depth-first</li>
                <li>Breadth-first</li>
            </ul>
        </AccordionDetails>
      </Accordion>
    </div>
  );
}

