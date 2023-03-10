import React from 'react'
import Skill from './Skill'
import '../../assets/styles/skill.css'

function SkillList({ skillList, onRemove }) {
  return (
    <div className="skillList-section">
      {skillList &&
        skillList.map((item, index) => <Skill skill={item} id={item} key={index} onRemove={onRemove}></Skill>)}
    </div>
  )
}

export default SkillList
