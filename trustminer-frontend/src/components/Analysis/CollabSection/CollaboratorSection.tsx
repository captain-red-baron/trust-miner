import React, {useEffect, useState} from "react";
import {TrustReport} from "../../../model/TrustReport";
import {Grid} from "@material-ui/core";
import CollaboratorSelector from "./CollaboratorSelector";
import {Collaborator} from "../../../model/Collaborator";
import UncertaintyStats from "./UncertaintyStats";
import UncertaintyDependencies from "./UncertaintyDependencies";
import TrustConcernChart from "./TrustConcernChart";
import {mapToTrustConcernChartData, mapToUncertaintyComponentData} from "../../../util/chart_util";
import ComponentTypesChart from "./ComponentTypesChart";
import {mapToCritical} from "../../../util/miner_util";

interface CollaboratorSectionProps {
    trustReport: TrustReport,
    selectedPerspective: string
}

export default function CollaboratorSection(props: CollaboratorSectionProps) {
    const {trustReport, selectedPerspective} = props
    const [selectedCollaboratorName, setSelectedCollaboratorName] = useState<string>(trustReport.collaborators[0].name)
    const [selectedCollaborator, setSelectedCollaborator] =
        useState<Collaborator>(mapToCritical(trustReport, trustReport.collaborators[0], selectedPerspective))
    const collaboratorNames = trustReport.collaborators.map(collaborator => collaborator.name).filter(name => name !== selectedPerspective)
    useEffect(() => {
        if (selectedPerspective === selectedCollaboratorName) {
            let nextCollaboratorName = collaboratorNames.filter(name => name !== selectedPerspective)[0]
            setSelectedCollaboratorName(nextCollaboratorName)
            let collaborator = trustReport.collaborators.filter(collaborator => collaborator.name !== selectedPerspective)[0]
            setSelectedCollaborator(mapToCritical(trustReport, collaborator, selectedPerspective))
        } else {
            let collaborator = trustReport.collaborators.find(collaborator => collaborator.name === selectedCollaboratorName)
            if (collaborator) {
                setSelectedCollaborator(mapToCritical(trustReport, collaborator, selectedPerspective))
            }
        }
    }, [selectedCollaboratorName, trustReport.collaborators, selectedPerspective])

    useEffect(() => {
    }, [selectedPerspective])
    return (
        <div data-tour="collab-section" style={{width: "100%"}}>
            <CollaboratorSelector collaboratorNames={collaboratorNames} setSelected={setSelectedCollaboratorName}/>
            <Grid justify="space-between" alignItems="stretch" container spacing={2} style={{width: "100%"}}>
                <Grid item xs>
                    <UncertaintyStats lu={selectedCollaborator.laneUncertainty}
                                      rlu={selectedCollaborator.relativeLanceUncertainty}
                                      lub={selectedCollaborator.laneUncertaintyBalance}/>
                </Grid>

                <Grid item>
                    <TrustConcernChart chartData={mapToTrustConcernChartData(selectedCollaborator)}/>
                </Grid>
                <Grid item xs>
                    <UncertaintyDependencies dd={selectedCollaborator.dataInDegree}
                                             di={selectedCollaborator.dataOutDegree}
                                             md={selectedCollaborator.messageInDegree}
                                             mi={selectedCollaborator.messageOutDegree}/>
                </Grid>
                <Grid item>
                    <ComponentTypesChart chartData={mapToUncertaintyComponentData(selectedCollaborator.uncertainties)}/>
                </Grid>
            </Grid>
        </div>
    )
}