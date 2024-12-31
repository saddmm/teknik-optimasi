function submitData() {
    const formData = new FormData(document.getElementById("dataForm"));
    const data = {};
    
    formData.forEach((value, key) => {
      data[key] = value;
    });

    function vogelApproximationMethod(costMatrix, supply, demand) {
        const rows = costMatrix.length;
        const cols = costMatrix[0].length;
    
        let allocation = Array.from({ length: rows }, () => Array(cols).fill(0));
        let totalCost = 0;
    
        // Salin supply dan demand agar tidak mengubah array asli
        let remainingSupply = [...supply];
        let remainingDemand = [...demand];
    
        while (remainingSupply.some(s => s > 0) && remainingDemand.some(d => d > 0)) {
            // Hitung penalti untuk setiap baris dan kolom
            const rowPenalties = [];
            const colPenalties = [];
    
            for (let i = 0; i < rows; i++) {
                if (remainingSupply[i] > 0) {
                    const sortedCosts = costMatrix[i]
                        .map((cost, j) => (remainingDemand[j] > 0 ? cost : Infinity))
                        .sort((a, b) => a - b);
                    rowPenalties[i] = sortedCosts[1] - sortedCosts[0];
                } else {
                    rowPenalties[i] = -1;
                }
            }
    
            for (let j = 0; j < cols; j++) {
                if (remainingDemand[j] > 0) {
                    const sortedCosts = costMatrix
                        .map((row, i) => (remainingSupply[i] > 0 ? row[j] : Infinity))
                        .sort((a, b) => a - b);
                    colPenalties[j] = sortedCosts[1] - sortedCosts[0];
                } else {
                    colPenalties[j] = -1;
                }
            }
    
            // Temukan penalti terbesar
            let maxPenalty = -1;
            let selectedRow = -1;
            let selectedCol = -1;
    
            for (let i = 0; i < rows; i++) {
                if (rowPenalties[i] > maxPenalty) {
                    maxPenalty = rowPenalties[i];
                    selectedRow = i;
                    selectedCol = -1;
                }
            }
    
            for (let j = 0; j < cols; j++) {
                if (colPenalties[j] > maxPenalty) {
                    maxPenalty = colPenalties[j];
                    selectedRow = -1;
                    selectedCol = j;
                }
            }
    
            // Pilih elemen dengan penalti terbesar
            if (selectedRow !== -1) {
                const colIndex = costMatrix[selectedRow]
                    .map((cost, j) => (remainingDemand[j] > 0 ? cost : Infinity))
                    .indexOf(Math.min(...costMatrix[selectedRow].map((cost, j) => (remainingDemand[j] > 0 ? cost : Infinity))));
                selectedCol = colIndex;
            } else if (selectedCol !== -1) {
                const rowIndex = costMatrix
                    .map((row, i) => (remainingSupply[i] > 0 ? row[selectedCol] : Infinity))
                    .indexOf(Math.min(...costMatrix.map(row => (remainingSupply[rows.indexOf(row)] > 0 ? row[selectedCol] : Infinity))));
                selectedRow = rowIndex;
            }
    
            // Validasi agar tidak ada nilai undefined
            if (selectedRow === -1 || selectedCol === -1) {
                throw new Error("Tidak dapat menemukan elemen untuk dialokasikan.");
            }
    
            // Alokasikan supply/demand ke sel yang dipilih
            const allocationAmount = Math.min(remainingSupply[selectedRow], remainingDemand[selectedCol]);
            allocation[selectedRow][selectedCol] = allocationAmount;
            totalCost += allocationAmount * costMatrix[selectedRow][selectedCol];
    
            // Perbarui supply dan demand
            remainingSupply[selectedRow] -= allocationAmount;
            remainingDemand[selectedCol] -= allocationAmount;
        }
    
        return { allocation, totalCost };
    }

    const costMatrix = [
        [parseInt(data.sm1), parseInt(data.sm2), parseInt(data.sm3)], // Sumber mainan
        [parseInt(data.smp1), parseInt(data.smp2), parseInt(data.smp3)], // Sumber mainan putra
        [parseInt(data.smt1), parseInt(data.smt2), parseInt(data.smt3)]  // Sumber mainan toys
    ];
    
    // Supply dari masing-masing sumber
    const supply = [parseInt(data.sm_supply), parseInt(data.smp_supply), parseInt(data.smt_supply)];
    
    // Demand dari masing-masing tujuan
    const demand = [parseInt(data.demand_sm), parseInt(data.demand_smp), parseInt(data.demand_smt)];
    const resultt = document.querySelector(".result");

    
    
    
    try {
        const result = vogelApproximationMethod(costMatrix, supply, demand);
        function rupiah(number) {
            return new Intl.NumberFormat("id-ID", {
                style: "currency",
                currency: "IDR"
              }).format(number);
        }
        resultt.innerText = `Total biaya minimum: ${rupiah(result.totalCost)}`
        console.log("Allocation Matrix:");
        console.log(result.allocation);
        console.log("Total Minimum Cost:", result.totalCost);
    } catch (error) {
        console.error("Error:", error.message);
    }
    
    console.log("Submitted Data:", data);
  }

// Biaya pengiriman antar titik (Cost Matrix)

