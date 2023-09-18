import React, { useEffect, useState } from 'react';
import '../ProcessPage.css'
import CombinedSection from './CombinedSection';
import CombinedSection_Python from './CombinedSection_Python';
import CombinedSection_Alteryx from './CombinedSection_Alteryx';

function ProcessPage() {
    const initialSections = [
        {
            id: 'section1',
            backgroundImg: "/images/uipath-logo.png",
            backgroundSize: '60% auto',
        },
        {
            id: 'section2',
            backgroundImg: "/images/alteryx-logo.png",
            backgroundSize: '60% auto',
        },
        {
            id: 'section3',
            backgroundImg: "/images/python-logo.png",
            backgroundSize: '66% auto',
        },
    ];
    debugger;

    const [sections, setSections] = useState(initialSections);
    const [selectedSection, setSelectedSection] = useState(null);
    const [combinedSectionContent, setCombinedSectionContent] = useState(null);
    const [visible, setVisible] = useState('')
    const [move, setMove] = useState();

    const handleSectionClick = (sectionId) => {
        if (selectedSection === sectionId) {
            // 如果点击已选中的 section，取消选中状态
            setSelectedSection(null);
            setCombinedSectionContent(null);
            setSections(initialSections);
        } else {
            //找到选中的section
            const selected = sections.find((section) => section.id === sectionId);
            // 设置 CombinedSection 的内容（您可以根据需要设置内容）
            setCombinedSectionContent("");
            // 更新 selectedSection
            setSelectedSection(selected.id);
            //更新sections数组，只包含选中的 section
            setSections([selected]);
        }
    };

    useEffect(() => {
        setTimeout(() => {
            setVisible('show')
        }, 10)
    })

    useEffect(() => {
        if (move) {
            setSelectedSection(move, id)
            // setSections([move])
        }
    }, [move])

    return (
        <div className="process-page">
            {sections.map((section) => (
                <div
                    key={section.id}
                    className={`custom-section ${move && move.id === section.id ? 'move' : ''} ${selectedSection === section.id ? 'selected' : ''} ${visible}`}
                    id={section.id}
                    onClick={() => handleSectionClick(section.id)}
                    style={{
                        backgroundImage: `url(${section.backgroundImg})`,
                        backgroundSize: `${section.backgroundSize}`,
                        backgroundRepeat: 'no-repeat',
                        backgroundPosition: 'center center',
                    }}
                >
                </div>
            ))}
            {console.log("selected_Value", selectedSection)}
            {(selectedSection === 'section1') && (
                <CombinedSection updateContent={setCombinedSectionContent} content={combinedSectionContent} />
            ) || (selectedSection === 'section2') && (
                <CombinedSection_Alteryx updateContent={setCombinedSectionContent} content={combinedSectionContent} />
            ) || (selectedSection === 'section3') && (
                <CombinedSection_Python updateContent={setCombinedSectionContent} content={combinedSectionContent} />
            )}
        </div>
    );
}

export default ProcessPage;