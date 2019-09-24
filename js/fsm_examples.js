var fsm_examples = {
  "DFA AB": {"type":"DFA","dfa":{"transitions":{"start":{"A":"s0"},"s0":{"B":"s1"},"s1":{"A":"s2"},"s2":{"B":"s1"}},"startState":"start","acceptStates":["s1"]},"states":{"start":{},"s0":{"top":186,"left":208},"s1":{"isAccept":true,"top":296,"left":231},"s2":{"top":372,"left":70}},"transitions":[{"stateA":"start","label":"A","stateB":"s0"},{"stateA":"s0","label":"B","stateB":"s1"},{"stateA":"s1","label":"A","stateB":"s2"},{"stateA":"s2","label":"B","stateB":"s1"}],"bulkTests":{"accept":"AB\nABAB\nABABAB","reject":"\nA\nB\nABA\nBA\nBB\nABABB"}},
};
