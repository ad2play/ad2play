// dashboard for the landing page of the webapp where the general composition of tasks are shown in a pie chart
<template>
    <h2>Welcome to ad2play - From Security Advisories to Vulnerability Playbooks</h2>

    <div class="p-grid p-fluid dashboard">
        <div class="p-col-12 p-lg-4">
            <div class="card">
                <h3>Task Composition</h3>
                <div>
                    <Chart type="doughnut" :data="chartData" :options="lightOptions" />
                </div>
            </div>
        </div>
    </div>
</template>

<script>

export default {
    components: {
    },
	data() {
		return {
            chartData: {
                labels: ['Open','Done','Approved'],
                datasets: [
                    {
                        data: [0, 0, 0],
                        backgroundColor: ["#F3DA0B","#2271B3","#57A639"],
                        hoverBackgroundColor: ["#F3DA0B","#2271B3","#57A639"]
                    }
                ]
            },
			lightOptions: {
				plugins: {
                    legend: {
                        labels: {
                            color: '#495057'
                        }
                    }
                }
			}
		}
	},
    computed: {
        tasks() {
            return this.$store.getters['task/list'];
        }
    },
    methods: {
        async fetchData() {
            try{
                await this.$store.dispatch('task/fetchAll', {
                    forceRefresh: true
                });
                this.analyseData();
            } catch (error) {
                console.log(error);
            }
        },
        analyseData() {
            const taskArr = this.tasks;
            let open = 0;
            let done = 0;
            let approved = 0;

            for (const t of taskArr) {
                if (t.done) {
                    done += 1;
                } else {
                    open += 1;
                }

                if (t.approved) {
                    approved += 1;
                }
            }
            this.chartData.datasets[0].data = [open, done, approved];
        }
    },
    created() {
        this.fetchData();
    }	
}
</script>
