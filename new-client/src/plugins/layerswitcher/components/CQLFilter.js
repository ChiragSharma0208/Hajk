import React, { useState } from "react";
import {
  InputLabel,
  OutlinedInput,
  IconButton,
  InputAdornment,
  Tooltip
} from "@material-ui/core";
import RefreshIcon from "@material-ui/icons/Refresh";

const CQLFilter = ({ layer }) => {
  const source = layer.getSource();
  const currentCqlFilterValue =
    source.constructor.name !== "ImageWMS" &&
    source.constructor.name !== "TiledWMS"
      ? ""
      : source.getParams()?.CQL_FILTER;

  const [cqlFilter, setCqlFilter] = useState(currentCqlFilterValue);

  const updateFilter = () => {
    let filter = cqlFilter.trim();
    if (filter.length === 0) filter = undefined;
    layer.getSource().updateParams({ CQL_FILTER: filter });
  };

  return (
    <>
      <InputLabel htmlFor="cqlfilter">Ange CQL-filter</InputLabel>
      <OutlinedInput
        id="cqlfilter"
        type="text"
        multiline
        fullWidth
        placeholder="foo='bar' AND fii='baz'"
        value={cqlFilter}
        onChange={e => setCqlFilter(e.target.value)}
        endAdornment={
          <InputAdornment position="end">
            <Tooltip title="Tryck för att ladda om lagret med angivet filter">
              <IconButton edge="end" onClick={updateFilter}>
                <RefreshIcon />
              </IconButton>
            </Tooltip>
          </InputAdornment>
        }
      />
    </>
  );
};

export default CQLFilter;
