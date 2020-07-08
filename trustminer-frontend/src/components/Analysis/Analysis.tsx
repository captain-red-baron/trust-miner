import React, {useEffect, useState} from "react";
import {generateGraphData} from "../../miner/relationshipAnalysis";
import RelationshipGraph from "./RelationshipGraph";
import {GraphData} from "../../model/GraphData";
import {CircularProgress} from "@material-ui/core";
import UncertaintyChart from "./UncertaintyChart";
import UncertaintyChartData from "../../model/UncertaintyChartData";
import {getCollaborators, getUncertaintyDistributionData} from "../../miner/uncertaintyAggregation";
import {filterWithTrustPolicies} from "../../miner/trustAnalysis";

export default function Analysis() {
    const [graphData, setGraphData] = useState<GraphData>()
    const [uncertaintyData, setUncertaintyData] = useState<UncertaintyChartData>()

    useEffect(() => {
        generateGraphData().then(data => setGraphData(data))
        getCollaborators().then(collaborators => console.log(filterWithTrustPolicies(collaborators)))
        getUncertaintyDistributionData().then(data => setUncertaintyData(data))
    }, [])

    return (
        <>
            {graphData ? <RelationshipGraph graphData={graphData}/> : <CircularProgress/>}
            {uncertaintyData ? <UncertaintyChart data={uncertaintyData}/> : <CircularProgress/>}
        </>

    )
}